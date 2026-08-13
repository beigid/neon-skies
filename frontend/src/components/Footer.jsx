import React from 'react';
import { Plane, Database, Cloud, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-sky-950/90 text-slate-400 py-10 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white font-mono text-sm tracking-wide">
                NEON SKIES
              </div>
              <p className="text-slate-400">
                Decoupled Flight Fare Scraper & BI Analytics Engine
              </p>
            </div>
          </div>

          {/* Stack Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Neon Postgres
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              GCP Cloud Run
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Metabase BI (Local)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              React + Vite + Tailwind
            </span>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Built with modern serverless data engineering practices. Zero hosting costs for public frontend & BI presentation layer.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Neon Skies &copy; {new Date().getFullYear()}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
