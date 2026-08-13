import os
import json
from datetime import datetime
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "frontend", "public", "data", "flights.json")

def export_flight_data():
    """Exports all flight rows from Neon PostgreSQL to static JSON for zero-cost hosting."""
    if not DB_URL:
        print("DATABASE_URL is not set.")
        return

    print(f"[{datetime.now()}] Connecting to Neon PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    query = """
        SELECT 
            id, 
            extracted_at, 
            COALESCE(origin, 'SEA') as origin,
            COALESCE(destination, 'LAX') as destination,
            base_price::float, 
            cabin_class, 
            upgrade_cost::float, 
            boarding_group, 
            available_seats_left 
        FROM flight_prices 
        ORDER BY extracted_at DESC;
    """

    cur.execute(query)
    rows = cur.fetchall()

    records = []
    for r in rows:
        records.append({
            "id": r[0],
            "extracted_at": r[1].isoformat() if isinstance(r[1], datetime) else str(r[1]),
            "origin": r[2],
            "destination": r[3],
            "base_price": float(r[4]) if r[4] is not None else 0.0,
            "cabin_class": r[5] or "Economy",
            "upgrade_cost": float(r[6]) if r[6] is not None else 0.0,
            "boarding_group": r[7] or "N/A",
            "available_seats_left": r[8]
        })

    cur.close()
    conn.close()

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    print(f"[{datetime.now()}] Exported {len(records)} records to {OUTPUT_PATH}")

if __name__ == "__main__":
    export_flight_data()
