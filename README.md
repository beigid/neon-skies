# Neon Skies: Flight Fare & Time-Series BI Intelligence Pipeline

**Neon Skies** is an automated cloud data engineering pipeline and interactive analytics platform designed to track, store, and model commercial flight prices and cabin upgrade deltas over time.

Built to optimize flight purchasing decisions, this project features a **fully decoupled architecture**: a containerized Python ETL engine on Google Cloud Platform, a serverless PostgreSQL database (Neon), a local containerized Metabase BI analytics layer, and a lightweight public React dashboard hosted for **$0**.

---

## 🏗️ Architecture & Tech Stack

```
[ SerpApi / Google Flights ]
          │
          ▼  (Daily Trigger via Cloud Scheduler)
[ GCP Cloud Run Jobs (Docker Container / Python ETL) ]
          │
          ▼  (psycopg2 Time-Series Inserts)
[ Neon Serverless PostgreSQL Database ]
       ┌──┴───────────────────────────────┐
       ▼                                  ▼
[ Metabase BI (Local Docker) ]    [ Netlify Serverless Functions / Driver ]
(Private Internal Command Center)         │
                                          ▼  (Live Serverless SQL Queries)
                               [ Public React + Vite Frontend ]
                               (Hosted on Netlify / Vercel - $0)
```

* **Data Extraction (ETL):** Python (`requests`, `psycopg2`), SerpApi (Google Flights API)
* **Cloud Execution:** Docker, GCP Artifact Registry, Cloud Run Jobs, Cloud Scheduler
* **Database:** Serverless PostgreSQL (Hosted via [Neon](https://neon.tech))
* **Internal BI & Analytics:** Containerized [Metabase](https://www.metabase.com) (Run locally via Docker)
* **Public Frontend:** React 18, Vite 5, Tailwind CSS, Recharts, Lucide React, Neon Serverless Driver

---

## 📊 Internal Analytics (Metabase Command Center)

Metabase is run containerized **locally on machine** to act as a private BI command center. It syncs directly with the live Neon PostgreSQL database to monitor pipeline health, execute raw SQL aggregations, and compute rolling price floors—without incurring cloud server hosting costs.

### Metabase Executive BI Dashboard
![Metabase Dashboard](assets/metabase_dashboard.jpg)

### Native Metabase SQL Workbench & Time-Series Analytics
![Metabase SQL Workbench](assets/metabase_sql.jpg)

---

## 💻 Public Frontend & Live Dashboard

For recruiters and hiring managers to interactively explore flight fare trends live, a decoupled web application is located in the `/frontend` directory.

### Key Capabilities
* **Interactive Time-Series Charts:** Multi-route filtering (SEA-LAX, JFK-LHR, SFO-HND, BOS-MIA, ORD-DEN), custom date ranges (7D, 14D, 30D, All), and 7-day moving average overlays powered by Recharts.
* **Cabin Upgrade Delta Tracker:** Evaluates base economy fares vs premium upgrade margins.
* **Live Serverless Connection:** Directly connects to Neon PostgreSQL via Netlify serverless functions and client-side Neon serverless driver with fallback demo data mode.
* **Metabase BI Showcase Modal:** Embedded screenshot gallery and SQL query inspector for internal BI proof of work.

---

## 🚀 Getting Started

### 1. Running the Python ETL Scraper
Set up your `.env` file with your credentials:
```env
DATABASE_URL=postgresql://user:password@ep-cool-db.neon.tech/neondb
SERPAPI_API_KEY=your_serpapi_key_here
```
Run the scraper:
```bash
python main.py
```

### 2. Running the Public Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### 3. Deploying Frontend to Netlify or Vercel ($0 Cost)
1. Push your repository to GitHub.
2. Import the project in Netlify or Vercel.
3. Set the **Root Directory** to `frontend`.
4. Add environment variable: `DATABASE_URL=postgresql://...`
5. Build command: `npm run build`, Output directory: `dist`.
6. Deploy! Cost: **$0.00/mo**.

---

## 🛠️ Key Data Engineering Highlights
* **Decoupled Architecture:** Compute, database, internal BI, and public presentation run independently.
* **Fault-Tolerant ETL:** Validates API responses, manages database connection pools, and handles schema initialization dynamically.
* **Zero-Cost Hosting Play:** Local Docker Metabase for internal analytics + serverless frontend/API layer eliminates fixed server bills while delivering full interactive features.