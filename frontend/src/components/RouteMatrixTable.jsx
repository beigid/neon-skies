import React from 'react';
import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';

const MONITORED_CORRIDORS = [
  { id: 'SEA-LAX', origin: 'SEA', dest: 'LAX', route: 'SEA → LAX', name: 'Seattle to Los Angeles', defaultMin: 149, defaultAvg: 185, defaultCurrent: 149, defaultTrend: '-19.4%', defaultIsDrop: true, defaultSignal: 'BUY NOW' },
  { id: 'JFK-LHR', origin: 'JFK', dest: 'LHR', route: 'JFK → LHR', name: 'New York to London', defaultMin: 540, defaultAvg: 652, defaultCurrent: 580, defaultTrend: '-11.0%', defaultIsDrop: true, defaultSignal: 'BUY NOW' },
  { id: 'SFO-HND', origin: 'SFO', dest: 'HND', route: 'SFO → HND', name: 'San Francisco to Tokyo', defaultMin: 790, defaultAvg: 910, defaultCurrent: 880, defaultTrend: '+4.2%', defaultIsDrop: false, defaultSignal: 'WAIT' },
  { id: 'BOS-MIA', origin: 'BOS', dest: 'MIA', route: 'BOS → MIA', name: 'Boston to Miami', defaultMin: 185, defaultAvg: 220, defaultCurrent: 195, defaultTrend: '-11.3%', defaultIsDrop: true, defaultSignal: 'BUY NOW' },
  { id: 'ORD-DEN', origin: 'ORD', dest: 'DEN', route: 'ORD → DEN', name: 'Chicago to Denver', defaultMin: 125, defaultAvg: 155, defaultCurrent: 130, defaultTrend: '-16.1%', defaultIsDrop: true, defaultSignal: 'BUY NOW' },
];

export default function RouteMatrixTable({ records = [], onSelectRoute }) {
  const rows = MONITORED_CORRIDORS.map(corridor => {
    const routeRecords = records.filter(
      r => r.origin === corridor.origin && r.destination === corridor.dest
    );

    if (routeRecords.length > 0) {
      // Sort chronologically
      const sorted = [...routeRecords].sort(
        (a, b) => new Date(a.extracted_at) - new Date(b.extracted_at)
      );
      
      const prices = sorted.map(r => r.base_price).filter(p => typeof p === 'number' && !isNaN(p));
      const minPrice = Math.min(...prices);
      const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      const currentPrice = sorted[sorted.length - 1].base_price;
      
      // Calculate 7-day delta if enough data points exist
      let trendStr = corridor.defaultTrend;
      let isDrop = corridor.defaultIsDrop;
      
      if (sorted.length >= 2) {
        const firstPrice = sorted[Math.max(0, sorted.length - 7)].base_price;
        const diff = currentPrice - firstPrice;
        const pct = ((diff / firstPrice) * 100).toFixed(1);
        trendStr = `${pct > 0 ? '+' : ''}${pct}%`;
        isDrop = diff <= 0;
      }
      
      const signal = currentPrice <= avgPrice ? 'BUY NOW' : 'WAIT';

      return {
        id: corridor.id,
        route: corridor.route,
        name: corridor.name,
        min: minPrice,
        avg: avgPrice,
        current: currentPrice,
        trend: trendStr,
        isDrop: isDrop,
        signal: signal
      };
    }

    // Default benchmark row
    return {
      id: corridor.id,
      route: corridor.route,
      name: corridor.name,
      min: corridor.defaultMin,
      avg: corridor.defaultAvg,
      current: corridor.defaultCurrent,
      trend: corridor.defaultTrend,
      isDrop: corridor.defaultIsDrop,
      signal: corridor.defaultSignal
    };
  });

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 my-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Monitored Route Corridors
          </h3>
          <p className="text-xs text-slate-400">
            Real-time price floor indicators updated by Neon DB
          </p>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <th className="py-2.5 px-3">Route</th>
              <th className="py-2.5 px-3">Min</th>
              <th className="py-2.5 px-3">Avg Floor</th>
              <th className="py-2.5 px-3">Current</th>
              <th className="py-2.5 px-3">7D Delta</th>
              <th className="py-2.5 px-3">Signal</th>
              <th className="py-2.5 px-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-white font-mono">
                  {row.route}
                </td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">${row.min}</td>
                <td className="py-3 px-3 font-mono text-slate-400">${row.avg}</td>
                <td className="py-3 px-3 font-mono text-white font-bold">${row.current}</td>
                <td className="py-3 px-3 font-mono">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    row.isDrop ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {row.isDrop ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {row.trend}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                    row.signal === 'BUY NOW'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {row.signal}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectRoute(row.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-sky-950 text-slate-300 transition-colors"
                    title={`Inspect ${row.route} time-series chart`}
                    aria-label={`Inspect ${row.route}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
