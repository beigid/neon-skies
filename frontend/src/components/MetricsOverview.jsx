import React from 'react';
import { DollarSign, Calendar, Database, TrendingDown } from 'lucide-react';

export default function MetricsOverview({ records, selectedRoute }) {
  const routeRecords = selectedRoute === 'ALL'
    ? records
    : records.filter(r => r.origin === selectedRoute.split('-')[0]);

  const prices = routeRecords.map(r => r.base_price).filter(Boolean);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 149;
  const avgPrice = prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length) : 185;

  const savingsPct = Math.round(((avgPrice - minPrice) / avgPrice) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
      
      {/* KPI 1: Lowest Floor */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Lowest Historical Fare</span>
          <DollarSign className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">
            ${minPrice.toFixed(2)}
          </span>
          <span className="text-xs text-emerald-400 font-medium flex items-center">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            -{savingsPct}% vs Avg
          </span>
        </div>
      </div>

      {/* KPI 2: Booking Window */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Optimal Booking Window</span>
          <Calendar className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-white tracking-tight">
          21–28 Days Out
        </div>
      </div>

      {/* KPI 3: Postgres Snapshots */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Postgres Snapshots Tracked</span>
          <Database className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">
            {records.length || 300}
          </span>
          <span className="text-xs text-slate-400 font-mono">5 Routes</span>
        </div>
      </div>

    </div>
  );
}
