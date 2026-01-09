import React, { useState } from 'react';
import { 
  Settings, Share2, Activity, Database, Zap, Info, 
  TrendingUp, Clock, DollarSign, User, AlertTriangle, 
  ShieldCheck, Terminal 
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"; 
import { useRCCStore } from './store'; 
import RelationalGraph from './RelationalGraph';
import FaultLog from './components/faultlog'; // <--- New Component

function App() {
  const { user, isSignedIn } = useUser(); 
  const { 
    isPredicting, 
    setPredicting, 
    compressionLevel, 
    setCompression,
    rawText,      
    currentTime,    
    setCurrentTime, 
    getPredictedValue,
    analyzeTopic, 
    volatilityData 
  } = useRCCStore();

  const marketValue = getPredictedValue(currentTime);
  const currentYearStats = volatilityData[currentTime] || { score: 0, status: 'Idle', reasons: [] };
  const isRupture = currentYearStats.status === "Rupture";

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeTopic(e.target.value);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* 1. LEFT PANEL: Search Interface & Policy */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-emerald-500" size={24} />
          <h2 className="text-xl font-bold tracking-tight uppercase">Fault <span className="text-emerald-500">Quant</span></h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-widest">Asset Analysis Input</label>
            <textarea 
              className={`w-full h-32 bg-slate-900 border ${isPredicting ? 'border-emerald-500/50' : 'border-slate-700'} rounded-xl p-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none text-slate-50 shadow-inner`}
              placeholder="Enter Market Asset (e.g. Gold, Reliance, TCS)..."
              onKeyDown={handleKeyDown}
            />
            {isPredicting && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <Terminal size={24} className="text-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 animate-pulse">EXECUTING LOGIC AGENT...</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-1 text-[9px] text-emerald-600/80 font-bold uppercase tracking-widest">
            <ShieldCheck size={12} />
            <span>Shariah/Ethical Filters Active</span>
          </div>
        </div>

        {/* INTEGRATED: The Logic Breakdown Panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
           <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-widest">Audit Trail</label>
           <FaultLog />
        </div>

        <div className="mt-4">
          <div className={`p-4 rounded-xl border transition-all duration-500 ${isRupture ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <label className="text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center mb-3">
              <span>Risk Sensitivity</span>
              <span className={isRupture ? 'text-red-400' : 'text-emerald-400'}>{compressionLevel}%</span>
            </label>
            <input 
              type="range" min="0" max="100" value={compressionLevel}
              className="w-full h-1.5 accent-emerald-500 cursor-pointer" 
              onChange={(e) => setCompression(parseInt(e.target.value))}
            />
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: Topology View */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRupture ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-slate-400">Institutional Topology</span>
            </div>
            <span className="text-slate-700 font-light">/</span>
            <span className="text-emerald-500 text-[10px] font-mono font-bold tracking-widest">{rawText || "SYSTEM_READY"}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <SignedOut><SignInButton mode="modal"><button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">ACCESS_GATE</button></SignInButton></SignedOut>
             <SignedIn><UserButton /></SignedIn>
          </div>
        </header>

        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#064e3b_0%,_#020617_100%)]">
           {isRupture && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 bg-red-600/20 border border-red-500/50 backdrop-blur-md rounded-full flex items-center gap-3 shadow-2xl shadow-red-500/20">
               <AlertTriangle size={16} className="text-red-500 animate-bounce" />
               <span className="text-xs font-black text-red-500 uppercase tracking-widest">Structural Fault Identified</span>
             </div>
           )}
          <RelationalGraph />
        </div>

        {/* BOTTOM PANEL: Timeline */}
        <footer className="h-24 border-t border-slate-800 bg-slate-950 px-8 flex items-center gap-8 shadow-2xl">
          <div className="flex flex-col items-center gap-1 min-w-[120px]">
            <Clock className="text-emerald-400" size={20} />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Temporal Axis</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between px-1">
              <span className="text-[9px] font-bold text-slate-600 uppercase">2021 HIST</span>
              <span className={`text-xs font-mono font-bold ${isRupture ? 'text-red-400 underline underline-offset-4' : 'text-emerald-400'}`}>
                INDEX_YEAR: {currentTime}
              </span>
              <span className="text-[9px] font-bold text-slate-600 uppercase">2026 PROJ</span>
            </div>
            <input 
              type="range" min="2021" max="2026" step="1" value={currentTime}
              onChange={(e) => setCurrentTime(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all" 
            />
          </div>
          
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
             <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Status</span>
             <span className={`text-[11px] font-mono font-bold ${isRupture ? 'text-red-500' : 'text-emerald-400'}`}>{currentYearStats.status}</span>
          </div>
        </footer>
      </main>

      {/* 3. RIGHT PANEL: Analytics */}
      <aside className="w-72 border-l border-slate-800 bg-slate-900/50 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-emerald-400" size={24} />
          <h2 className="text-lg font-bold tracking-tight">Valuation Insights</h2>
        </div>

        <div className="space-y-6">
          <div className={`p-5 rounded-2xl border transition-all duration-500 ${isRupture ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isRupture ? 'text-red-400' : 'text-emerald-500'}`}>
              True Market Value
            </p>
            <p className="text-3xl font-mono font-bold text-white tracking-tighter">{marketValue}</p>
            <p className="text-[9px] text-slate-500 mt-2 uppercase font-medium font-mono">Verified Node: {currentTime}</p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fault Intensity</p>
            <p className={`text-3xl font-mono font-bold ${isRupture ? 'text-red-400' : 'text-emerald-400'}`}>
              {currentYearStats.score}%
            </p>
            <div className="w-full bg-slate-900 h-1 mt-3 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${isRupture ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${currentYearStats.score}%` }}></div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-lg text-center">
           <p className="text-[9px] text-emerald-700 uppercase tracking-widest font-black">
             {isSignedIn ? `CLIENT: ${user.lastName?.toUpperCase()}` : 'SECURE_SANDBOX_MODE'}
           </p>
        </div>
      </aside>
    </div>
  );
}

export default App;