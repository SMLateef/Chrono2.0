import React from 'react';
import { useRCCStore } from '../store';
import { 
  ShieldCheck, AlertTriangle, Info, Terminal, 
  Wind, Car, ShieldAlert, TrendingDown, Zap, BrainCircuit 
} from 'lucide-react';

export default function FaultLog() {
  // 1. Extract global state
  const { isPredicting, selectedCity, volatilityData } = useRCCStore();

  // 2. THE LOADING GUARD: Prevents "Offline" messages while AI is thinking
  if (isPredicting) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center gap-4 bg-slate-950/50 rounded-xl border border-slate-800 backdrop-blur-sm">
        <div className="relative">
          <Zap size={28} className="text-emerald-500 animate-spin" />
          <div className="absolute inset-0 blur-lg bg-emerald-500/20 animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-emerald-500 animate-pulse tracking-widest">
            INITIALIZING_AI_AUDIT
          </span>
          <span className="text-[8px] text-slate-600 font-mono uppercase text-center">
            Scanning {selectedCity} Infrastructure...
          </span>
        </div>
      </div>
    );
  }

  // 3. Extract city-specific data
  const cityData = volatilityData[selectedCity?.toLowerCase()];
  
  // 4. Case where data isn't available after loading (Fallback Guard)
  if (!cityData) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-xl">
        <BrainCircuit className="mx-auto mb-2 text-slate-800" size={24} />
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Awaiting Telemetry Data</p>
      </div>
    );
  }

  const aiVerdict = cityData.aiVerdict || { compliance: "Stable", reasons: [] };

  // Icon selector based on keywords from the AI reasoning
  const getIssueIcon = (text) => {
    const t = text.toLowerCase();
    if (t.includes('aqi') || t.includes('air') || t.includes('pollution')) return <Wind size={14} className="text-sky-400" />;
    if (t.includes('transport') || t.includes('traffic') || t.includes('commute') || t.includes('infrastructure')) return <Car size={14} className="text-amber-400" />;
    if (t.includes('crime') || t.includes('safety') || t.includes('police')) return <ShieldAlert size={14} className="text-red-400" />;
    if (t.includes('poverty') || t.includes('growth') || t.includes('economic')) return <TrendingDown size={14} className="text-emerald-400" />;
    return <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      
      {/* 5. Header: City Context */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
            {selectedCity} AUDIT_LOG
          </span>
        </div>
        <div className={`text-[9px] px-2 py-0.5 rounded font-black tracking-widest ${
          cityData.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {cityData.status.toUpperCase()}
        </div>
      </div>

      {/* 6. Content: Top Issues List */}
      <div className="p-4 space-y-5 overflow-y-auto">
        <section>
          <h4 className="text-[10px] text-slate-500 mb-3 font-bold uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-600" />
            Governance Analysis
          </h4>
          <div className="space-y-4">
            {aiVerdict.reasons.slice(0, 3).map((issue, idx) => (
              <div key={idx} className="flex gap-3 group bg-slate-900/30 p-2.5 rounded-lg border border-transparent hover:border-slate-700 transition-all duration-300">
                <div className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                  {getIssueIcon(issue)}
                </div>
                <div>
                    <p className="text-[12px] text-slate-300 font-mono leading-tight">
                        <span className="text-emerald-500 font-bold mr-1 italic">0{idx + 1}</span> {issue}
                    </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Critical Rupture Warning */}
        {cityData.status === 'Critical' && (
          <div className="mt-2 p-3 bg-red-950/20 border border-red-900/50 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Fault Identified</span>
            </div>
            <p className="text-[11px] text-red-200/70 leading-normal italic font-mono">
              "Threshold breach in {selectedCity}. Structural governance failure detected in core infrastructure."
            </p>
          </div>
        )}
      </div>

      {/* 8. Footer: Authenticity Stamp */}
      <div className="mt-auto p-3 bg-slate-900/30 border-t border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cityData.status === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
            <span className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">Verified Audit: {selectedCity.toUpperCase()}</span>
        </div>
        <div className="text-[8px] text-slate-700 font-bold uppercase">v2.0_Urban</div>
      </div>
    </div>
  );
}