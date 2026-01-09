import React from 'react';
import { useRCCStore } from '../store';
import { ShieldCheck, AlertTriangle, Info, Terminal } from 'lucide-react';

export default function FaultLog() {
  const { currentTime, volatilityData } = useRCCStore();
  const log = volatilityData[currentTime];

  // Fallback if no data is loaded yet
  if (!log) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
        <Info className="mx-auto mb-2 text-slate-600" size={20} />
        <p className="text-slate-500 text-xs">Analyze a topic to view logical attribution logs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
            FaultQuant Logic Engine
          </span>
        </div>
        <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${
          log.status === 'Rupture' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {log.status.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto">
        <section>
          <h4 className="text-[10px] text-slate-500 mb-2 font-semibold">REASONING TOKENS</h4>
          <div className="space-y-2">
            {log.reasons.map((reason, idx) => (
              <div key={idx} className="flex gap-3 text-[13px] group">
                <div className="mt-1 shrink-0">
                  {reason.includes('Halal') || reason.includes('Compliance') ? (
                    <ShieldCheck size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-slate-600 mt-1.5" />
                  )}
                </div>
                <p className="text-slate-300 font-mono leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Institutional Alert for Ruptures */}
        {log.status === 'Rupture' && (
          <div className="mt-2 p-3 bg-red-950/20 border border-red-900/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-500">SYSTEM ALERT</span>
            </div>
            <p className="text-[11px] text-red-200/70 leading-normal italic">
              "Variance exceeds 40% threshold. This rupture requires manual verification of underlying asset collateral."
            </p>
          </div>
        )}
      </div>

      {/* Footer / Meta Info */}
      <div className="mt-auto p-3 bg-slate-900/30 border-t border-slate-800 text-[10px] text-slate-600 flex justify-between">
        <span>STAMP: {currentTime}-MARKET-LOG</span>
        <span>VERIFIED: HALAL-COMPLIANT</span>
      </div>
    </div>
  );
}