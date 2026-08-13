import os
import time
from datetime import datetime, timedelta
import psycopg2
import requests
from dotenv import load_dotenv

# Load environment variables (.env file if present)
load_dotenv()

# 1. Configuration & Credentials
DB_URL = os.getenv("DATABASE_URL")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

# Target corridors monitored by Neon Skies
MONITORED_ROUTES = [
    {"origin": "SEA", "destination": "LAX", "name": "Seattle (SEA) → Los Angeles (LAX)"},
    {"origin": "JFK", "destination": "LHR", "name": "New York (JFK) → London (LHR)"},
    {"origin": "SFO", "destination": "HND", "name": "San Francisco (SFO) → Tokyo (HND)"},
    {"origin": "BOS", "destination": "MIA", "name": "Boston (BOS) → Miami (MIA)"},
    {"origin": "ORD", "destination": "DEN", "name": "Chicago (ORD) → Denver (DEN)"},
]

def get_db_connection():
    """Establishes connection to Neon Serverless PostgreSQL."""
    return psycopg2.connect(DB_URL)

def ensure_schema():
    """Ensures flight_prices table exists with origin & destination columns."""
    create_table_query = """
    CREATE TABLE IF NOT EXISTS flight_prices (
        id SERIAL PRIMARY KEY,
        extracted_at TIMESTAMP NOT NULL DEFAULT NOW(),
        origin VARCHAR(10) DEFAULT 'SEA',
        destination VARCHAR(10) DEFAULT 'LAX',
        base_price NUMERIC(10, 2) NOT NULL,
        cabin_class VARCHAR(50) DEFAULT 'Economy',
        upgrade_cost NUMERIC(10, 2) DEFAULT 0.00,
        boarding_group VARCHAR(20) DEFAULT 'N/A',
        available_seats_left INT DEFAULT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_flight_prices_route_extracted 
    ON flight_prices (origin, destination, extracted_at DESC);
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"[{datetime.now()}] Notice: Schema check completed with info: {e}")

# 2. The Live Data Fetcher
def fetch_flight_data(origin, destination, travel_date):
    """Fetches real flight prices from SerpApi's Google Flights endpoint."""
    print(f"[{datetime.now()}] Fetching live fare for {origin} → {destination} (Travel date: {travel_date})...")

    if not SERPAPI_API_KEY:
        print("SERPAPI_API_KEY is not configured in environment.")
        return None

    url = "https://serpapi.com/search"
    params = {
        "engine": "google_flights",
        "departure_id": origin,
        "arrival_id": destination,
        "outbound_date": travel_date,
        "type": "2",  # "2" specifies a one-way ticket
        "currency": "USD",
        "hl": "en",
        "api_key": SERPAPI_API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=30)
        
        if response.status_code == 429:
            print(f"SerpApi rate limit/quota reached (HTTP 429) for {origin} → {destination}.")
            return None
            
        response.raise_for_status()
        data = response.json()

        # Check if SerpApi found "best_flights" or fallback to "other_flights"
        flights_list = data.get("best_flights") or data.get("other_flights", [])
        if flights_list:
            top_flight = flights_list[0]
            price = top_flight.get("price")
            
            if price is not None:
                # Calculate estimated premium upgrade delta (~35-45% of base)
                base_price = float(price)
                upgrade_cost = round(base_price * 0.35, 2)
                
                return {
                    "origin": origin,
                    "destination": destination,
                    "base_price": base_price,
                    "cabin_class": "Economy",
                    "upgrade_cost": upgrade_cost,
                    "boarding_group": "Group 2",
                    "available_seats_left": None
                }

        print(f"No flight options returned for route {origin} → {destination} on {travel_date}.")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Network/API error fetching flight data for {origin} → {destination}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error processing flight data: {e}")
        return None

# 3. The Extraction Job
def run_daily_extraction():
    """Runs batch extraction for all monitored flight corridors."""
    ensure_schema()
    
    # Target departure: 30 days ahead
    target_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    print(f"[{datetime.now()}] Initiating batch extraction across {len(MONITORED_ROUTES)} corridors for travel date {target_date}...")
    
    extracted_records = []
    
    for route in MONITORED_ROUTES:
        origin = route["origin"]
        dest = route["destination"]
        
        flight_info = fetch_flight_data(origin, dest, target_date)
        if flight_info:
            extracted_records.append(flight_info)
        
        # Pacing between external API queries to respect rate limits
        time.sleep(1.2)
        
    if not extracted_records:
        print(f"[{datetime.now()}] No new records were extracted in this run.")
        return

    # Batch insert to Neon Serverless PostgreSQL
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO flight_prices 
            (extracted_at, origin, destination, base_price, cabin_class, upgrade_cost, boarding_group, available_seats_left)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        now = datetime.now()
        inserted_count = 0
        for rec in extracted_records:
            cursor.execute(insert_query, (
                now,
                rec["origin"],
                rec["destination"],
                rec["base_price"],
                rec["cabin_class"],
                rec["upgrade_cost"],
                rec["boarding_group"],
                rec["available_seats_left"]
            ))
            inserted_count += 1

        conn.commit()
        cursor.close()
        conn.close()
        print(f"[{datetime.now()}] Successfully saved {inserted_count} flight records to Neon PostgreSQL!")

    except Exception as e:
        print(f"Database insertion failed: {e}")

# 4. Entrypoint for Cloud Run Job / Local Container Execution
if __name__ == "__main__":
    print(f"[{datetime.now()}] Neon Skies Flight Scraper Execution Started.")
    run_daily_extraction()
    print(f"[{datetime.now()}] Neon Skies Flight Scraper Execution Finished. Exiting cleanly.")