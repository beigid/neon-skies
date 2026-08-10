import os
import psycopg2
import requests
from datetime import datetime, timedelta

# 1. Configuration & Credentials
DB_URL = os.getenv("DATABASE_URL")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

def get_db_connection():
  return psycopg2.connect(DB_URL)

# 2. The Live Data Fetcher
def fetch_flight_data(origin, destination, travel_date):
  """Fetches real flight prices from SerpApi's Google Flights endpoint."""
  print(f"[{datetime.now()}] Fetching live data for {origin} to {destination}...")

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
    response.raise_for_status()
    data = response.json()

    # Check if SerpApi found "best_flights"
    best_flights = data.get("best_flights", [])
    if best_flights:
      # Grab the price of the first "best" flight recommendation
      price = best_flights[0].get("price")
      return {
        "base_price": float(price),
        "cabin_class": "Economy",
        "upgrade_cost": 0.00,
        "boarding_group": "N/A",
        "available_seats_left": None
      }
    else:
      print(f"No flights found for route {origin}-{destination} on {travel_date}.")
      return None

  except Exception as e:
    print(f"Error fetching flight data: {e}")
    return None

# 3. The Extraction Job
def run_daily_extraction():
  # Example: Look for flights 30 days from today
  target_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')

  origin = "SEA"       # Seattle
  destination = "LAX"  # Los Angeles

  flight_info = fetch_flight_data(origin, destination, target_date)

  if flight_info:
    try:
      conn = get_db_connection()
      cursor = conn.cursor()

      insert_query = """
                     INSERT INTO flight_prices
                     (extracted_at, base_price, cabin_class, upgrade_cost, boarding_group, available_seats_left)
                     VALUES (%s, %s, %s, %s, %s, %s) \
                     """
      cursor.execute(insert_query, (
        datetime.now(),
        flight_info['base_price'],
        flight_info['cabin_class'],
        flight_info['upgrade_cost'],
        flight_info['boarding_group'],
        flight_info['available_seats_left']
      ))

      conn.commit()
      cursor.close()
      conn.close()
      print(f"Successfully saved ${flight_info['base_price']} to database!")

    except Exception as e:
      print(f"Database insertion failed: {e}")

# 4. Entrypoint for Cloud Run Job / Local Container Execution
if __name__ == "__main__":
  print(f"[{datetime.now()}] Flight Scraper Execution Started.")
  run_daily_extraction()
  print(f"[{datetime.now()}] Flight Scraper Execution Finished. Exiting cleanly.")