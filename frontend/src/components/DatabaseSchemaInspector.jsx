import React, { useState } from 'react';
import { Database, Code2, Copy, Check, Terminal, FileText } from 'lucide-react';

export default function DatabaseSchemaInspector({ records }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('schema');

  const ddlQuery = `CREATE TABLE IF NOT EXISTS flight_prices (
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

-- Composite Index for time-series corridor queries
CREATE INDEX idx_flight_prices_route_extracted 
ON flight_prices (origin, destination, extracted_at DESC);`;

  const sampleJson = JSON.stringify({
    extracted_at: "2026-08-12T22:00:00Z",
    origin: "SEA",
    destination: "LAX",
    base_price: 149.00,
    cabin_class: "Economy",
    upgrade_cost: 45.00,
    boarding_group: "Group 2",
    available_seats_left: 4
  }, null, 2);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 border border-slate-800 my-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Neon PostgreSQL Schema & Data Pipeline Inspector
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/30">
              Normalized DDL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Relational schema definition and SerpApi payload mapping executed in Python
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-sky-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'schema'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Postgres DDL
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'payload'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sample Record JSON
          </button>
        </div>
      </div>

      {/* Code Display Box */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-sky-950">
        <div className="flex items-center justify-between px-4 py-2 bg-sky-900/60 border-b border-slate-800 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            {activeTab === 'schema' ? 'schema.sql — Neon Postgres DDL' : 'payload.json — ETL Sample Record'}
          </span>
          <button
            onClick={() => handleCopy(activeTab === 'schema' ? ddlQuery : sampleJson)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto custom-scrollbar">
          {activeTab === 'schema' ? ddlQuery : sampleJson}
        </pre>
      </div>

      {/* Info Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-3 rounded-xl bg-sky-900/40 border border-slate-800 text-xs space-y-1">
          <div className="font-bold text-white">Database Engine</div>
          <div className="text-slate-400">PostgreSQL 16 (Hosted on Neon Serverless)</div>
        </div>
        <div className="p-3 rounded-xl bg-sky-900/40 border border-slate-800 text-xs space-y-1">
          <div className="font-bold text-white">Extraction Frequency</div>
          <div className="text-slate-400">Daily Cron execution via GCP Cloud Run Jobs</div>
        </div>
        <div className="p-3 rounded-xl bg-sky-900/40 border border-slate-800 text-xs space-y-1">
          <div className="font-bold text-white">Public Hosting Mode</div>
          <div className="text-slate-400">Decoupled Static JSON Sync ($0 Cost)</div>
        </div>
      </div>

    </div>
  );
}
