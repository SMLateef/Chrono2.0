import React, { useState } from 'react';
import { Settings, Share2, Activity, Database, Zap, Info, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useRCCStore } from './store'; 
import RelationalGraph from './RelationalGraph';

function App() {
  const { 
    isPredicting, 
    setPredicting, 
    compressionLevel, 
    setCompression,
    rawText,      
    setRawText,
    currentTime,    // New from Store
    setCurrentTime, // New from Store
    getPredictedValue // New from Store
  } = useRCCStore();

  // Influence slider tied to global compression level
  const contextValue = compressionLevel;

  // Calculate Market Value based on the active year on the timeline
  const marketValue = getPredictedValue(currentTime);

  // Metrics derived from store state
  const compressionRatio = (1 + (contextValue / 20)).toFixed(1);
  const redundancyFiltered = Math.round(contextValue * 0.85);
  const stabilityIndex = (0.75 + (contextValue / 1000) + (currentTime - 2021)/100).toFixed(2);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* 1. LEFT PANEL: Input & Context */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <Database className="text-cyan-400" size={24} />
          <h2 className="text-xl font-bold tracking-tight">RCC Input</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block tracking-wider">Raw Data (X)</label>
            <textarea 
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none text-cyan-50"
              placeholder="Enter text..."
              value={rawText} 
              onChange={(e) => setRawText(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block tracking-wider">Context (C)</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm outline-none cursor-pointer text-slate-300">
              <option>Clinical / Healthcare</option>
              <option>Market Intelligence</option>
              <option>Supply Chain Logistics</option>
            </select>
          </div>
        </div>

        <div className="mt-auto pb-4">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 shadow-inner">
            <label className="text-xs font-semibold uppercase text-slate-400 flex justify-between items-center">
              <span>Influence φ(C)</span>
              <span className="text-cyan-400 font-mono text-base">{contextValue}%</span>
            </label>
            <input 
              type="range" 
              min="0"
              max="100"
              value={contextValue}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer mt-4 accent-cyan-400" 
              onChange={(e) => setCompression(parseInt(e.target.value))}
            />
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: Relational Visualization */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30">
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="uppercase tracking-widest text-xs tracking-[0.2em]">Relational Layer</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-xs font-mono tracking-widest text-[10px]">YEAR: {currentTime}</span>
          </div>
          <div className="flex gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-800 rounded-md transition-colors"><Share2 size={18}/></button>
            <button className="p-2 hover:bg-slate-800 rounded-md transition-colors"><Settings size={18}/></button>
          </div>
        </header>

        <div className="flex-1 relative">
          <RelationalGraph />
        </div>

        {/* 4. BOTTOM PANEL: Temporal Timeline (5-Year Predictor) */}
        <footer className="h-24 border-t border-slate-800 bg-slate-900/90 px-8 flex items-center gap-8 backdrop-blur-md">
          <div className="flex flex-col items-center gap-1 min-w-[140px]">
            <Clock className="text-indigo-400" size={20} />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">Temporal Axis</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-slate-500 px-2 font-mono text-[10px] tracking-widest">
              <span>2021 (Start)</span>
              <span className="text-indigo-400 font-bold">ANALYZING: {currentTime}</span>
              <span>2026 (Prediction)</span>
            </div>
            <input 
              type="range" 
              min="2021" max="2026" 
              step="1"
              value={currentTime}
              onChange={(e) => setCurrentTime(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all" 
            />
          </div>
          
          <button 
            onClick={() => setPredicting(true)}
            disabled={isPredicting}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold transition-all 
            ${isPredicting ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 active:scale-95'}`}
          >
            <Zap size={14} className={isPredicting ? "animate-pulse text-cyan-400" : ""} /> 
            {isPredicting ? "PROJECTION IN PROGRESS..." : "RUN FULL PREDICTION"}
          </button>
        </footer>
      </main>

      {/* 3. RIGHT PANEL: Metrics & Financial Prediction */}
      <aside className="w-72 border-l border-slate-800 bg-slate-900/50 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-8 text-white">
          <Activity className="text-emerald-400" size={24} />
          <h2 className="text-xl font-bold tracking-tight">Analytics</h2>
        </div>

        <div className="space-y-6">
          {/* Predictive Value Card */}
          <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <DollarSign size={10}/> Projected Market Value
            </p>
            <p className="text-4xl font-mono font-bold text-white tracking-tighter">${marketValue}</p>
            <p className="text-[9px] text-slate-500 mt-2 font-medium">Relational Valuation at T-{currentTime}</p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Compression Ratio (f)</p>
            <p className="text-3xl font-mono font-bold text-emerald-400">{compressionRatio} : 1</p>
          </div>

          <div className="bg-indigo-950/20 p-5 rounded-xl border border-indigo-500/20 border-t-indigo-500/50 mt-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                <TrendingUp size={12}/> Influence Trend
              </h4>
              <span className={`flex h-2 w-2 rounded-full ${isPredicting ? 'bg-cyan-400 animate-ping' : 'bg-indigo-500'}`}></span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-500 font-medium tracking-tight">Stability Index</span>
                <span className="text-sm font-mono text-slate-200">{stabilityIndex}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-500 font-medium tracking-tight">Market Maturity</span>
                <span className="text-sm font-mono text-emerald-400">
                   {currentTime < 2024 ? 'Exploratory' : 'Stable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-cyan-950/10 border border-cyan-900/30 rounded-lg">
           <p className="text-[10px] text-cyan-600 leading-relaxed italic text-center">
             "Prediction is a function of relational drift over the temporal axis."
           </p>
        </div>
      </aside>
    </div>
  );
}

export default App;