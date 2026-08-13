import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

const ROUTES = [
  { id: 'SEA-LAX', name: 'SEA → LAX' },
  { id: 'JFK-LHR', name: 'JFK → LHR' },
  { id: 'SFO-HND', name: 'SFO → HND' },
  { id: 'BOS-MIA', name: 'BOS → MIA' },
  { id: 'ORD-DEN', name: 'ORD → DEN' },
];

export default function PriceTrendChart({ records, selectedRoute, setSelectedRoute }) {
  const [timeRange, setTimeRange] = useState('30D');

  const chartData = useMemo(() => {
    if (!records || records.length === 0) return [];

    let filtered = records.filter(r => {
      if (selectedRoute === 'ALL') return true;
      const [orig, dest] = selectedRoute.split('-');
      return r.origin === orig && (dest ? r.destination === dest : true);
    });

    filtered.sort((a, b) => new Date(a.extracted_at) - new Date(b.extracted_at));

    const maxDays = timeRange === '7D' ? 7 : timeRange === '14D' ? 14 : timeRange === '30D' ? 30 : 60;
    const sliced = filtered.slice(-maxDays);

    return sliced.map((item) => {
      const dateObj = new Date(item.extracted_at);
      const dateFormatted = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

      return {
        dateStr: dateFormatted,
        rawDate: item.extracted_at,
        base_price: item.base_price,
        upgrade_cost: item.upgrade_cost,
        route_name: item.route_name
      };
    });
  }, [records, selectedRoute, timeRange]);

  const minPrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map(d => d.base_price));
  }, [chartData]);

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 my-4 space-y-4">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Fare Time-Series Trend
          </h2>
          <p className="text-xs text-slate-400">
            Historical price observations recorded in Neon PostgreSQL
          </p>
        </div>

        {/* Route Pills & Time Range */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['7D', '14D', '30D', 'ALL'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500 text-sky-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Route Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
        {ROUTES.map(route => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route.id)}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
              selectedRoute === route.id
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {route.name}
          </button>
        ))}
      </div>

      {/* Recharts Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fareGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="dateStr" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={minPrice}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{ value: `Floor: $${minPrice}`, fill: '#10b981', fontSize: 11, position: 'right' }}
            />

            <Area
              type="monotone"
              dataKey="base_price"
              stroke="#00f2fe"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fareGradient)"
              name="Base Fare"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2.5 rounded-lg border border-slate-700 bg-sky-950/95 text-xs space-y-1 shadow-lg">
        <div className="font-mono text-cyan-400 font-bold">
          {data.dateStr}
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span>Base Economy Fare:</span>
          <strong className="font-mono text-white">${data.base_price?.toFixed(2)}</strong>
        </div>
      </div>
    );
  }
  return null;
}
