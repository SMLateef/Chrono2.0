import React from 'react';
import { 
  Activity, Zap, Info, TrendingUp, MapPin, 
  ShieldCheck, Terminal, Menu, AlertTriangle, 
  Car, Wind, ShieldAlert, TrendingDown, Target 
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"; 
import { useRCCStore } from './store'; 
import RelationalGraph from './RelationalGraph';
import FaultLog from './components/faultlog'; 
import { useIsMobile } from './hooks/use-mobile';

function App() {
  const isMobile = useIsMobile();
  const { user, isSignedIn } = useUser(); 
  
  const { 
    isPredicting, 
    analyzeMetros, 
    volatilityData, 
    selectedCity, 
    setSelectedCity 
  } = useRCCStore();
  React.useEffect(() => {
    analyzeMetros();
  }, [analyzeMetros]); // Adding analyzeMetros to dependency array is a best practice

  /** * CRITICAL FIX: Optional Chaining (?.) 
   * This prevents the "Blank Screen" by returning undefined instead of crashing 
   * if volatilityData[selectedCity] hasn't loaded yet.
   */
  const cityData = volatilityData[selectedCity?.toLowerCase()] || { 
    score: 0, 
    status: 'Idle', 
    metrics: { aqi: 0, transport: 0, crime: 0, poverty: 0, growth: 0 } 
  };
  
  const isCritical = cityData.status === "Critical";

  React.useEffect(() => {
    analyzeMetros();
  }, [analyzeMetros]);

  return (
    <div className={`flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans ${isMobile ? 'flex-col' : 'flex-row'}`}>
      
      {/* 1. LEFT PANEL: Audit Trail & Selection */}
      {!isMobile && (
        <aside className="w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold tracking-tight uppercase tracking-widest">Fault <span className="text-emerald-500">Urban</span></h2>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-widest">Metro Selection</label>
            <div className="grid grid-cols-2 gap-2">
              {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`py-2 px-3 rounded-lg border text-[10px] font-bold transition-all ${
                    selectedCity === city 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {city.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-1 text-[9px] text-emerald-600/80 font-bold uppercase tracking-widest">
              <ShieldCheck size={12} />
              <span>Governance Framework Active</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
             <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block tracking-widest">AI Audit Trail</label>
             <FaultLog />
          </div>
        </aside>
      )}

      {/* 2. CENTER PANEL: Topology View */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30 shrink-0">
          <div className="flex items-center gap-4">
            {isMobile && <Menu size={20} className="text-slate-400" />}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span className="uppercase tracking-[0.1em] text-[10px] font-bold text-slate-400">
                Urban Fault Topology / <span className="text-emerald-500">{selectedCity}</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <SignedOut><SignInButton mode="modal"><button className="text-[10px] font-bold text-slate-500 hover:text-white">AUTH_ACCESS</button></SignInButton></SignedOut>
             <SignedIn><UserButton /></SignedIn>
          </div>
        </header>

        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#064e3b_0%,_#020617_100%)]">
           {isCritical && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 bg-red-600/20 border border-red-500/50 backdrop-blur-md rounded-full flex items-center gap-3 shadow-2xl shadow-red-500/30">
               <AlertTriangle size={16} className="text-red-500 animate-bounce" />
               <span className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">Governance Rupture Detected</span>
             </div>
           )}
          <RelationalGraph />
        </div>

        {/* BOTTOM PANEL: Metric Bar (Updated to include 5 categories) */}
        <footer className="h-20 border-t border-slate-800 bg-slate-950 px-8 flex items-center justify-between shadow-2xl">
           <div className="flex gap-8 overflow-x-auto no-scrollbar py-2">
              <MetricItem icon={<Wind size={14}/>} label="AQI" value={cityData?.metrics?.aqi ?? "..."} color="text-sky-400" />
              <MetricItem icon={<Car size={14}/>} label="Transport" value={cityData?.metrics?.transport ? `${cityData.metrics.transport}m` : "..."} color="text-amber-400" />
              <MetricItem icon={<ShieldAlert size={14}/>} label="Crime" value={cityData?.metrics?.crime ?? "..."} color="text-red-400" />
              <MetricItem icon={<TrendingDown size={14}/>} label="Poverty" value={cityData?.metrics?.poverty ? `${cityData.metrics.poverty}%` : "..."} color="text-emerald-400" />
              <MetricItem icon={<Target size={14}/>} label="Growth" value={cityData?.metrics?.growth ? `${cityData.metrics.growth}%` : "..."} color="text-cyan-400" />
           </div>
           {!isMobile && (
             <button onClick={() => analyzeMetros()} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/50 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-all group">
                <Zap size={14} className={`text-emerald-500 ${isPredicting ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">RESCAN_SYSTEM</span>
             </button>
           )}
        </footer>
      </main>

      {/* 3. RIGHT PANEL: Analytics */}
      {!isMobile && (
        <aside className="w-72 border-l border-slate-800 bg-slate-900/50 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="text-emerald-400" size={24} />
            <h2 className="text-lg font-bold tracking-tight">Governance Index</h2>
          </div>

          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400 font-mono">Fault_Intensity</p>
              <p className={`text-4xl font-mono font-bold tracking-tighter ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>{cityData?.score ?? "0.0"}</p>
              <div className="mt-4 flex items-center justify-between text-[9px] uppercase font-bold text-slate-500">
                <span>Infrastructure Health</span>
                <span>{100 - (cityData?.score ?? 0)}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 mt-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${100 - (cityData?.score ?? 0)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
               <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Audit_Memo</span>
               </div>
               <p className="text-[11px] text-slate-400 leading-relaxed italic">
                 "The AI Auditor identifies {selectedCity}'s primary governance rupture is currently related to {cityData?.aiVerdict?.primaryFault || 'pending scan'}. Proactive infrastructure intervention is required."
               </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

// Helper Component (Updated for safety)
function MetricItem({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 border-r border-slate-800 pr-6 last:border-0 shrink-0">
      <div className={`p-2 rounded-lg bg-slate-900 ${color} border border-current/10`}>
        {icon}
      </div>
      <div>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">{label}</p>
        <p className="text-sm font-mono font-bold text-slate-200">{value}</p>
      </div>
    </div>
  )
}

export default App;