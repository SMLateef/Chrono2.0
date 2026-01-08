import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceArea 
} from 'recharts';
import { useRCCStore } from './store';

const ChronoChart = () => {
  const { historicalPoints, volatilityData, currentTime } = useRCCStore();

  // Helper: Formats numbers into Indian Lakhs/Crores
  const formatINR = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { year, valueINR } = payload[0].payload;
      const status = volatilityData[year]?.status;
      
      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Temporal Node: {year}</p>
          <p className="text-lg font-mono font-bold text-emerald-400">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(valueINR)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'Rupture' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className={`text-[10px] font-black uppercase ${status === 'Rupture' ? 'text-red-500' : 'text-emerald-500'}`}>
              {status} STATE
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-none px-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={historicalPoints} margin={{ top: 60, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="chronoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
          
          {/* X-AXIS: Temporal progression */}
          <XAxis 
            dataKey="year" 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            dy={20}
          />

          {/* Y-AXIS: Indian Valuation Scale */}
          <YAxis 
            orientation="right"
            stroke="#475569" 
            fontSize={10} 
            tickFormatter={formatINR}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 5000', 'dataMax + 5000']}
          />

          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="valueINR" 
            stroke="#22d3ee" 
            strokeWidth={3}
            fill="url(#chronoGradient)" 
            animationDuration={2500}
          />

          {/* Sync Highlight Column */}
          {currentTime && (
            <ReferenceArea 
              x1={currentTime} 
              x2={currentTime} 
              fill="#6366f1" 
              fillOpacity={0.1} 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChronoChart;