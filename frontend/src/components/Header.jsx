import React from 'react';
import { Plane, Activity, BarChart2, Zap } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onRefresh }) {
  return (
    <header className="border-b border-slate-800/80 bg-sky-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
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

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Neon DB Live
        </div>

      </div>
    </header>
  );
}
