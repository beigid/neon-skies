# Neon Skies: Flight Price & Time-Series Data Tracker

**Neon Skies** is an automated data engineering pipeline designed to track, store, and visualize commercial flight prices and upgrade costs over time.

Built to track pricing volatility and optimize ticket purchasing, this project acts as a fully decoupled, time-series data tracker. It utilizes an automated ETL extraction script, a serverless PostgreSQL database, and a standalone Business Intelligence dashboard for data analysis.

## Architecture & Tech Stack
This project was built to gain hands-on experience with production-grade data pipelines, container orchestration, and decoupled cloud architecture.
* **Data Extraction (ETL):** Python, `requests`, `beautifulsoup4`, `schedule`
* **Database:** PostgreSQL
* **Analytics & Visualization:** Metabase
* **Containerization:** Docker & Docker Compose
* **Orchestration:** Kubernetes (Minikube / Cloud K8s)

## How It Works
1. **The CronJob (Extract & Transform):** A Dockerized Python script wakes up daily to scrape base fares, cabin classes, and upgrade costs for targeted routes (e.g., SEA to NRT).
2. **The Database (Load):** The script writes this time-series data directly into a normalized PostgreSQL schema, keeping static route data separate from high-volume pricing snapshots.
3. **The BI Dashboard (Analyze):** A standalone Metabase container connects securely to the PostgreSQL database to generate line charts, identifying historical price floors and the best days of the week to book.

## Key Features
* **Fully Decoupled Infrastructure:** Scrapers, databases, and visualization tools run completely independently to maximize resource efficiency.
* **Kubernetes Orchestration:** Uses K8s `CronJobs` for the Python scraper and `Deployments`/`Services` to keep the Metabase dashboard highly available.
* **Automated Schema Management:** Python automatically initializes relational tables via `psycopg2` if they do not exist.
* **Secure Secrets Management:** Uses environment variables and K8s `Secrets` to ensure database connection strings are never exposed in the codebase.