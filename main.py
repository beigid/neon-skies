import os
import time
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import schedule

# --- 1. Database Configuration ---
DB_URL = os.getenv("DATABASE_URL", "postgresql://admin:password123@localhost:5432/flight_tracker")

def get_db_connection():
  """Establish a connection to the PostgreSQL database."""
  try:
    conn = psycopg2.connect(DB_URL)
    return conn
  except Exception as e:
    print(f"Database connection failed: {e}")
    return None

def initialize_database():
  """Create the necessary tables if they do not already exist."""
  print("Checking database tables...")
  conn = get_db_connection()
  if not conn:
    return

  try:
    with conn.cursor() as cur:
      # Table 1: The Static Routes
      cur.execute("""
                  CREATE TABLE IF NOT EXISTS tracked_routes (
                                                                id SERIAL PRIMARY KEY,
                                                                origin_airport VARCHAR(3) NOT NULL,
                      destination_airport VARCHAR(3) NOT NULL,
                      departure_date DATE NOT NULL,
                      return_date DATE,
                      airline VARCHAR(50) NOT NULL,
                      is_active BOOLEAN DEFAULT TRUE,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                      );
                  """)

      # Table 2: The Time-Series Price Data
      cur.execute("""
                  CREATE TABLE IF NOT EXISTS flight_prices (
                                                               id SERIAL PRIMARY KEY,
                                                               route_id INT REFERENCES tracked_routes(id) ON DELETE CASCADE,
                      captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      base_price NUMERIC(10, 2) NOT NULL,
                      cabin_class VARCHAR(20) DEFAULT 'Main',
                      upgrade_cost NUMERIC(10, 2) DEFAULT 0.00,
                      boarding_group VARCHAR(10),
                      available_seats_left INT
                      );
                  """)
      conn.commit()
      print("Database initialized successfully.")
  except Exception as e:
    print(f"Error initializing database: {e}")
  finally:
    conn.close()


# --- 2. Data Extraction ---
def fetch_flight_data(origin, destination, date):
  """
  Mock function to simulate scraping flight data.
  In the real version, we will use requests/BeautifulSoup or an API here.
  """
  print(f"Scraping prices for {origin} -> {destination} on {date}...")

  # Simulating a web request delay
  time.sleep(2)

  # Mock data return
  return {
    "base_price": 299.50,
    "cabin_class": "Main",
    "upgrade_cost": 150.00,
    "boarding_group": "C",
    "available_seats_left": 4
  }


# --- 3. ETL Pipeline Logic ---
def run_daily_extraction():
  """The main job that fetches prices for all active routes and saves them."""
  print(f"--- Starting Extraction Job at {datetime.now()} ---")

  conn = get_db_connection()
  if not conn:
    return

  try:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
      # 1. Get all active routes we want to track
      cur.execute("SELECT * FROM tracked_routes WHERE is_active = TRUE;")
      active_routes = cur.fetchall()

      if not active_routes:
        print("No active routes found. Please add a route to the database.")

      # 2. Loop through each route and extract data
      for route in active_routes:
        route_id = route['id']

        # Call our scraping function
        scraped_data = fetch_flight_data(
          origin=route['origin_airport'],
          destination=route['destination_airport'],
          date=route['departure_date']
        )

        # 3. Load the data into the price history table
        cur.execute("""
                    INSERT INTO flight_prices
                    (route_id, base_price, cabin_class, upgrade_cost, boarding_group, available_seats_left)
                    VALUES (%s, %s, %s, %s, %s, %s);
                    """, (
                      route_id,
                      scraped_data['base_price'],
                      scraped_data['cabin_class'],
                      scraped_data['upgrade_cost'],
                      scraped_data['boarding_group'],
                      scraped_data['available_seats_left']
                    ))

        print(f"Saved new price: ${scraped_data['base_price']} for Route ID {route_id}")

      conn.commit()
      print("--- Extraction Job Complete ---")

  except Exception as e:
    print(f"Error during extraction: {e}")
    conn.rollback()
  finally:
    conn.close()


# --- 4. Scheduler ---
if __name__ == "__main__":
  # Ensure database is ready before we start
  initialize_database()

  # For testing purposes, run it once immediately
  run_daily_extraction()

  # Schedule the job to run every day at 8:00 AM
  schedule.every().day.at("08:00").do(run_daily_extraction)

  print("Scheduler is running. Waiting for next job...")
  while True:
    schedule.run_pending()
    time.sleep(60)