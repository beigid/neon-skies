import React, { useState } from 'react';
import { BarChart3, Database, Shield, Code, ExternalLink, CheckCircle2, Eye, Server, Layers } from 'lucide-react';

export default function MetabaseShowcase() {
  const [activeImageTab, setActiveImageTab] = useState('dashboard');

  return (
    <div className="space-y-8 my-6">
      
      {/* Hero explanation card */}
      <div className="glass-panel p-6 border border-purple-500/30 relative overflow-hidden bg-gradient-to-r from-sky-950 via-purple-950/20 to-sky-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Decoupled BI Strategy
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                $0 Cloud Hosting Bill
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Internal Tooling & Metabase Analytics Hub
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Metabase is containerized via Docker and executed locally as an internal command center. It connects directly to the serverless <strong className="text-cyan-400">Neon PostgreSQL</strong> database to run SQL aggregations, track pricing volatility, and inspect data engineering pipeline health—without incurring cloud hosting overhead.
            </p>
          </div>

          <div className="shrink-0 space-y-2">
            <div className="p-4 rounded-xl bg-sky-900/80 border border-slate-700 text-xs font-mono space-y-1.5">
              <div className="text-purple-300 font-bold flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />
                Docker Container Stack
              </div>
              <div className="text-slate-400">Metabase v0.49.0 (Local)</div>
              <div className="text-slate-400">Host: localhost:3000</div>
              <div className="text-cyan-400">Target: Neon PostgreSQL Cloud</div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Showcase Section */}
      <div className="glass-panel p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Metabase Dashboard Live Previews
            </h3>
            <p className="text-xs text-slate-400">
              High-resolution captures of our internal BI analytics and custom SQL queries
            </p>
          </div>

          {/* Screenshot Switcher */}
          <div className="flex items-center bg-sky-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveImageTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeImageTab === 'dashboard'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Executive BI Dashboard
            </button>
            <button
              onClick={() => setActiveImageTab('sql')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeImageTab === 'sql'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Metabase SQL Workbench
            </button>
          </div>
        </div>

        {/* Display Active Metabase Screenshot */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-sky-950 group">
          {activeImageTab === 'dashboard' ? (
            <img
              src="/assets/metabase_dashboard.jpg"
              alt="Metabase Executive Flight Analytics Dashboard"
              className="w-full h-auto object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
          ) : (
            <img
              src="/assets/metabase_sql.jpg"
              alt="Metabase SQL Workbench Querying Neon Postgres"
              className="w-full h-auto object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
          )}

          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-sky-950/90 backdrop-blur-md border border-slate-700/80 text-xs flex items-center justify-between text-slate-300">
            <span className="font-mono text-purple-300">
              {activeImageTab === 'dashboard'
                ? '📌 Figure 1.1 — Executive BI Dashboard (Heatmaps, Time-Series & Airline Fare Distributions)'
                : '📌 Figure 1.2 — Metabase Native SQL Editor querying `flight_prices` table on Neon Cloud'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Rendered via Local Docker Metabase
            </span>
          </div>
        </div>
      </div>

      {/* SQL Queries & Schema breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Sample SQL Query 1 */}
        <div className="glass-panel p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <Code className="w-4 h-4" />
              SQL Question 1: 7-Day Moving Avg & Fare Floor
            </div>
            <span className="text-[10px] bg-sky-900 text-slate-400 px-2 py-0.5 rounded font-mono">PostgreSQL</span>
          </div>
          <pre className="p-3 rounded-xl bg-sky-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800/80">
{`SELECT 
  date_trunc('day', extracted_at) AS observation_day,
  MIN(base_price) AS fare_floor,
  AVG(base_price) AS avg_fare,
  AVG(upgrade_cost) AS avg_upgrade
FROM flight_prices
GROUP BY 1
ORDER BY 1 DESC
LIMIT 30;`}
          </pre>
          <p className="text-xs text-slate-400">
            Used in Metabase to calculate the rolling 30-day price floor and identify optimal ticket purchasing windows.
          </p>
        </div>

        {/* Card 2: Architecture Flow */}
        <div className="glass-panel p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold">
              <Layers className="w-4 h-4" />
              Architecture: Decoupled BI Data Flow
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">Pipeline</span>
          </div>
          
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-950 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
              <span><strong>GCP Cloud Run Job</strong> triggers Python scraper via daily cron schedule.</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-950 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
              <span>Persists normalized time-series rows to <strong>Neon Cloud Postgres</strong>.</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-950 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
              <span><strong>Metabase (Local Container)</strong> syncs schemas for internal BI analytics.</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-950 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">4</span>
              <span><strong>React Public App</strong> loads static JSON dump or API for live recruiters.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
