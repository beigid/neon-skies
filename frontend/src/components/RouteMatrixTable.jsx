import React from 'react';
import { Plane, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';

const MATRIX_DATA = [
  { route: 'SEA → LAX', name: 'Seattle to Los Angeles', min: 149, avg: 185, current: 149, trend: '-19.4%', isDrop: true, signal: 'BUY NOW' },
  { route: 'JFK → LHR', name: 'New York to London', min: 540, avg: 652, current: 580, trend: '-11.0%', isDrop: true, signal: 'BUY NOW' },
  { route: 'SFO → HND', name: 'San Francisco to Tokyo', min: 790, avg: 910, current: 880, trend: '+4.2%', isDrop: false, signal: 'WAIT' },
  { route: 'BOS → MIA', name: 'Boston to Miami', min: 185, avg: 220, current: 195, trend: '-11.3%', isDrop: true, signal: 'BUY NOW' },
  { route: 'ORD → DEN', name: 'Chicago to Denver', min: 125, avg: 155, current: 130, trend: '-16.1%', isDrop: true, signal: 'BUY NOW' },
];

export default function RouteMatrixTable({ onSelectRoute }) {
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
              <th className="py-2.5 px-3">60D Avg</th>
              <th className="py-2.5 px-3">Current</th>
              <th className="py-2.5 px-3">7D Delta</th>
              <th className="py-2.5 px-3">Signal</th>
              <th className="py-2.5 px-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {MATRIX_DATA.map((row) => (
              <tr key={row.route} className="hover:bg-slate-800/30 transition-colors">
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
                  <span className={row.signal === 'BUY NOW' ? 'text-emerald-400' : 'text-amber-400'}>
                    {row.signal}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectRoute(row.route)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-sky-950 text-slate-300 transition-colors"
                    title="Inspect Route"
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
