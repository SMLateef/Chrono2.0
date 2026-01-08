import React, { useState } from 'react';
import { Settings, Share2, Activity, Database, Zap, Info, TrendingUp, Clock, DollarSign, User, AlertTriangle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"; 
import { useRCCStore } from './store'; 
import RelationalGraph from './RelationalGraph';

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

  // 1. Get the real value from the fetched internet data
  const marketValue = getPredictedValue(currentTime);
  
  // 2. Get the status of the current year (Stable vs Rupture)
  const currentYearStats = volatilityData[currentTime] || { score: 0, status: 'Idle', desc: 'No Data Fetched' };
  const isRupture = currentYearStats.status === "Rupture";

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeTopic(e.target.value);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* 1. LEFT PANEL: Search Interface */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <Database className="text-cyan-400" size={24} />
          <h2 className="text-xl font-bold tracking-tight uppercase">Chrono <span className="text-cyan-400">AI</span></h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-widest">Internet Data Query (X)</label>
            <textarea 
              className={`w-full h-32 bg-slate-900 border ${isPredicting ? 'border-cyan-500/50' : 'border-slate-700'} rounded-xl p-4 text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none text-cyan-50 shadow-inner`}
              placeholder="Enter Market Asset (e.g. Gold, Bitcoin, Crude Oil)..."
              onKeyDown={handleKeyDown}
            />
            {isPredicting && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <Zap size={24} className="text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-cyan-400 animate-pulse">FETCHING INTERNET LOGS...</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-[9px] text-slate-600 italic px-1">AI will scan 2021-2026 logs for structural variance.</p>
        </div>

        <div className="mt-auto">
          <div className={`p-4 rounded-xl border transition-all duration-500 ${isRupture ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <label className="text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center mb-3">
              <span>Sensitivity Threshold</span>
              <span className={isRupture ? 'text-red-400' : 'text-cyan-400'}>{compressionLevel}%</span>
            </label>
            <input 
              type="range" min="0" max="100" value={compressionLevel}
              className="w-full h-1.5 accent-cyan-400 cursor-pointer" 
              onChange={(e) => setCompression(parseInt(e.target.value))}
            />
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: Map */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRupture ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`}></span>
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-slate-400">Market Topology</span>
            </div>
            <span className="text-slate-700 font-light">/</span>
            <span className="text-cyan-500 text-[10px] font-mono font-bold tracking-widest">{rawText || "IDLE_PENDING_INPUT"}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <SignedOut><SignInButton mode="modal"><button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">LOGIN</button></SignInButton></SignedOut>
             <SignedIn><UserButton /></SignedIn>
          </div>
        </header>

        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
           {isRupture && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 bg-red-600/20 border border-red-500/50 backdrop-blur-md rounded-full flex items-center gap-3 shadow-2xl shadow-red-500/20">
               <AlertTriangle size={16} className="text-red-500 animate-bounce" />
               <span className="text-xs font-black text-red-500 uppercase tracking-widest">Structural Rupture Identified</span>
             </div>
           )}
          <RelationalGraph />
        </div>

        {/* BOTTOM PANEL: Timeline */}
        <footer className="h-24 border-t border-slate-800 bg-slate-950 px-8 flex items-center gap-8 shadow-2xl">
          <div className="flex flex-col items-center gap-1 min-w-[120px]">
            <Clock className="text-indigo-400" size={20} />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Chrono Axis</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between px-1">
              <span className="text-[9px] font-bold text-slate-600 uppercase">2021 Hist.</span>
              <span className={`text-xs font-mono font-bold ${isRupture ? 'text-red-400 underline underline-offset-4' : 'text-indigo-400'}`}>
                CURRENT_INDEX: {currentTime}
              </span>
              <span className="text-[9px] font-bold text-slate-600 uppercase">2026 Proj.</span>
            </div>
            <input 
              type="range" min="2021" max="2026" step="1" value={currentTime}
              onChange={(e) => setCurrentTime(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all" 
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
          <Activity className="text-emerald-400" size={24} />
          <h2 className="text-lg font-bold tracking-tight">Data Insights</h2>
        </div>

        <div className="space-y-6">
          {/* Historical Data Card */}
          <div className={`p-5 rounded-2xl border transition-all duration-500 ${isRupture ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isRupture ? 'text-red-400' : 'text-emerald-500'}`}>
              Market Value (X)
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl text-slate-500 font-mono">$</span>
              <p className="text-4xl font-mono font-bold text-white tracking-tighter">{marketValue}</p>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 uppercase font-medium">Real-Time internet Log T-{currentTime}</p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volatility Score</p>
            <p className={`text-3xl font-mono font-bold ${isRupture ? 'text-red-400' : 'text-emerald-400'}`}>
              {currentYearStats.score}
            </p>
            <div className="w-full bg-slate-900 h-1 mt-3 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${isRupture ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${currentYearStats.score}%` }}></div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
            <h4 className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest flex items-center gap-2 mb-3">
              <TrendingUp size={12}/> Analysis Log
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "{currentYearStats.desc}"
            </p>
          </div>
        </div>

        <div className="mt-auto p-4 bg-cyan-950/10 border border-cyan-900/30 rounded-lg text-center">
           <p className="text-[9px] text-cyan-700 uppercase tracking-widest font-black">
             {isSignedIn ? `SYNCED: ${user.firstName}` : 'GUEST_ACCESS_ONLY'}
           </p>
        </div>
      </aside>
    </div>
  );
}

export default App;