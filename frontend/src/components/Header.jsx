import React from 'react';
import { Plane, Activity, BarChart2, Clock } from 'lucide-react';

function getBatchStatus(dateString) {
  if (!dateString) return { label: "Connecting...", isHealthy: true };
  
  const now = new Date();
  const date = new Date(dateString);
  
  // Compare calendar days
  const isToday = now.toDateString() === date.toDateString();
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (isToday) {
    return {
      label: "Today's Batch",
      isHealthy: true
    };
  }
  
  if (isYesterday) {
    return {
      label: "48h Cycle (Yesterday)",
      isHealthy: true
    };
  }

  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    label: `48h Cycle (${formattedDate})`,
    isHealthy: true
  };
}

function formatExactDate(dateString) {
  if (!dateString) return 'Pending sync';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

export default function Header({
  activeTab,
  setActiveTab,
  lastSynced = null,
  isLiveDB = false
}) {
  const batchStatus = getBatchStatus(lastSynced);
  const exactTime = formatExactDate(lastSynced);

  return (
    <header className="border-b border-slate-800/80 bg-sky-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white font-sans">
              Neon Skies
            </h1>
            <p className="text-[11px] text-slate-400">
              Flight Fare & Time-Series Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500 text-sky-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('metabase')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'metabase'
                ? 'bg-purple-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Internal BI (Metabase)
          </button>
        </nav>

        {/* Cadence-Aware Status Pill (No ticking minute counters) */}
        <div
          title={`ETL Architecture: 48-Hour Batch Cadence\nLast DB Snapshot: ${exactTime}\nStatus: Pipeline Healthy`}
          className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
            isLiveDB
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="font-semibold">{isLiveDB ? 'Neon DB Live' : 'Demo Dataset'}</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-300 hidden sm:inline flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400 inline -mt-0.5" />
            <span>{batchStatus.label}</span>
          </span>
        </div>

      </div>
    </header>
  );
}
