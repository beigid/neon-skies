# Neon Skies: Flight Price & Time-Series Data Tracker

**Neon Skies** is an automated data engineering pipeline designed to track, store, and visualize commercial flight prices and upgrade costs over time.

Built to optimize ticket purchasing decisions, this project features a fully decoupled architecture utilizing a containerized Python ETL script, a cloud-native PostgreSQL database (Neon), Google Cloud serverless infrastructure, and a standalone Business Intelligence dashboard (Metabase).
## Architecture & Tech Stack
This project showcases hands-on experience with cloud-native data pipelines, serverless container execution, and decoupled systems design.
* **Data Extraction (ETL):** Python (requests, psycopg2), SerpApi (Google Flights API)
* **Cloud Infrastructure & Execution:** Google Cloud Artifact Registry, Cloud Run Jobs, Cloud Scheduler
* **Database:** PostgreSQL (Hosted via Neon)
* **Analytics & Visualization:** Metabase (BI Dashboard)
* **Containerization:** Docker & Docker Compose

## How It Works
1. **The CronJob (Extract & Transform):** A containerized Python script fetches live, real-time pricing data for targeted routes (e.g., SEA to LAX) via SerpApi.
2. **The Database (Load):** The script establishes a secure connection to a serverless PostgreSQL database (Neon), writing time-series pricing snapshots into a normalized relational schema.
3. **Automated Cloud Execution:** Automated Cloud Execution: Packaged as a lightweight Docker image stored in Google Cloud Artifact Registry, the script is deployed via Google Cloud Run Jobs and automated by Cloud Scheduler to execute daily without manual intervention.
4. **The BI Dashboard (Analyze):** A standalone Metabase dashboard connects directly to the database to sync schemas and generate historical trend visualizations, identifying price floors and optimal booking windows.

## Key Features
* **Fully Decoupled Infrastructure:** Compute jobs, data storage, and analytics run completely independently to maximize resource efficiency and scalability.
* **Serverless Cloud Orchestration:** Leverages Google Cloud Run Jobs triggered by Google Cloud Scheduler to handle daily script execution seamlessly without requiring always-on servers.
* **Automated Schema Management:** Python automatically validates and initializes relational tables upon execution using psycopg2.
* **Secure Environment Configuration:** Strict separation of environment variables and secrets (`DATABASE_URL`, `SERPAPI_API_KEY`) to ensure database credentials are never exposed in version control.