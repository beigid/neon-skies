import React, { useState, useEffect, useCallback } from 'react';
import { neon } from '@neondatabase/serverless';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import PriceTrendChart from './components/PriceTrendChart';
import RouteMatrixTable from './components/RouteMatrixTable';
import MetabaseShowcase from './components/MetabaseShowcase';
import Footer from './components/Footer';

const ROUTE_NAMES = {
  'SEA-LAX': 'Seattle (SEA) → Los Angeles (LAX)',
  'JFK-LHR': 'New York (JFK) → London (LHR)',
  'SFO-HND': 'San Francisco (SFO) → Tokyo (HND)',
  'BOS-MIA': 'Boston (BOS) → Miami (MIA)',
  'ORD-DEN': 'Chicago (ORD) → Denver (DEN)',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoute, setSelectedRoute] = useState('SEA-LAX');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [isLiveDB, setIsLiveDB] = useState(false);

  // Fetch flight data on page load (tries Netlify function first for security, then direct client Neon query)
  const fetchFlightData = useCallback(async () => {
    setLoading(true);

    // 1. Try Netlify Serverless API endpoint (secure server-side DB query)
    try {
      const res = await fetch('/api/flights');
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          console.log("Fetched flight records via Netlify Serverless API.");
          const mapped = rows.map(r => {
            const origin = r.origin || "SEA";
            const destination = r.destination || "LAX";
            const routeKey = `${origin}-${destination}`;
            return {
              id: r.id,
              extracted_at: r.extracted_at,
              origin: origin,
              destination: destination,
              route_name: ROUTE_NAMES[routeKey] || `${origin} → ${destination}`,
              base_price: Number(r.base_price) || 0.0,
              cabin_class: r.cabin_class || "Economy",
              upgrade_cost: Number(r.upgrade_cost) || 0.0,
              boarding_group: r.boarding_group || "N/A",
              available_seats_left: r.available_seats_left
            };
          });

          const newestTime = rows.reduce((latest, r) => {
            const t = new Date(r.extracted_at).getTime();
            return t > latest ? t : latest;
          }, 0);

          setRecords(mapped);
          setLastSynced(newestTime > 0 ? new Date(newestTime).toISOString() : new Date().toISOString());
          setIsLiveDB(true);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log("Netlify function endpoint not available, falling back to direct query...", err);
    }
    
    // 2. Direct client query fallback (if VITE_DATABASE_URL is provided locally)
    const dbUrl = import.meta.env.VITE_DATABASE_URL || import.meta.env.DATABASE_URL;

    if (dbUrl) {
      try {
        console.log("Querying Neon PostgreSQL database directly...");
        const sql = neon(dbUrl);
        const rows = await sql`
          SELECT 
            id, 
            extracted_at, 
            COALESCE(origin, 'SEA') as origin,
            COALESCE(destination, 'LAX') as destination,
            base_price::float, 
            cabin_class, 
            upgrade_cost::float, 
            boarding_group, 
            available_seats_left 
          FROM flight_prices 
          ORDER BY extracted_at DESC
        `;

        if (rows && rows.length > 0) {
          const mapped = rows.map(r => {
            const origin = r.origin || "SEA";
            const destination = r.destination || "LAX";
            const routeKey = `${origin}-${destination}`;
            return {
              id: r.id,
              extracted_at: r.extracted_at,
              origin: origin,
              destination: destination,
              route_name: ROUTE_NAMES[routeKey] || `${origin} → ${destination}`,
              base_price: Number(r.base_price) || 0.0,
              cabin_class: r.cabin_class || "Economy",
              upgrade_cost: Number(r.upgrade_cost) || 0.0,
              boarding_group: r.boarding_group || "N/A",
              available_seats_left: r.available_seats_left
            };
          });

          const newestTime = rows.reduce((latest, r) => {
            const t = new Date(r.extracted_at).getTime();
            return t > latest ? t : latest;
          }, 0);

          setRecords(mapped);
          setLastSynced(newestTime > 0 ? new Date(newestTime).toISOString() : new Date().toISOString());
          setIsLiveDB(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Direct Neon DB query error, using fallback dataset:", err);
      }
    }

    // 3. Fallback demonstration dataset (if DB is unreachable)
    generateFallbackDataset();
    setLastSynced(new Date().toISOString());
    setIsLiveDB(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFlightData();
  }, [fetchFlightData]);

  const generateFallbackDataset = () => {
    const routes = [
      { origin: "SEA", dest: "LAX", name: "Seattle (SEA) → Los Angeles (LAX)", base: 149, volatility: 28 },
      { origin: "JFK", dest: "LHR", name: "New York (JFK) → London (LHR)", base: 540, volatility: 85 },
      { origin: "SFO", dest: "HND", name: "San Francisco (SFO) → Tokyo (HND)", base: 790, volatility: 135 },
      { origin: "BOS", dest: "MIA", name: "Boston (BOS) → Miami (MIA)", base: 185, volatility: 32 },
      { origin: "ORD", dest: "DEN", name: "Chicago (ORD) → Denver (DEN)", base: 125, volatility: 22 },
    ];
    
    const recs = [];
    const now = new Date();
    let rec_id = 1;

    for (let day = 0; day < 60; day++) {
      const current_date = new Date(now.getTime() - (60 - day) * 86400000);
      routes.forEach(route => {
        const sine_wave = Math.sin(day / 4.2) * route.volatility;
        const decay = day < 30 ? Math.max(0, (30 - day) * 1.6) : (day - 30) * 2.1;
        const noise = (Math.abs(Math.sin(day * rec_id)) * 18) - 9;
        
        const final_price = Math.round(Math.max(route.base * 0.7, route.base + sine_wave + decay + noise));

        recs.push({
          id: rec_id++,
          extracted_at: current_date.toISOString(),
          origin: route.origin,
          destination: route.dest,
          route_name: route.name,
          base_price: final_price,
          cabin_class: "Economy",
          upgrade_cost: Math.round(final_price * 0.35),
          boarding_group: "Group 2",
          available_seats_left: null
        });
      });
    }

    setRecords(recs);
  };

  return (
    <div className="min-h-screen bg-sky-950 text-slate-100 flex flex-col font-sans">
      
      {/* Sleek Header with Cadence-Aware Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSynced={lastSynced}
        isLiveDB={isLiveDB}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'dashboard' ? (
          <div className="space-y-4">
            {/* 3 Clean KPI Cards */}
            <MetricsOverview records={records} selectedRoute={selectedRoute} />

            {/* Time-Series Chart */}
            <PriceTrendChart
              records={records}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
            />

            {/* Route Matrix Table with live dynamic calculations */}
            <RouteMatrixTable
              records={records}
              onSelectRoute={(routeId) => {
                setSelectedRoute(routeId);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <div className="py-4">
            <MetabaseShowcase />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
