import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', scans: 45, treatments: 38 },
  { month: 'Feb', scans: 52, treatments: 44 },
  { month: 'Mar', scans: 61, treatments: 50 },
  { month: 'Apr', scans: 58, treatments: 49 },
  { month: 'May', scans: 72, treatments: 63 },
  { month: 'Jun', scans: 85, treatments: 74 },
  { month: 'Jul', scans: 94, treatments: 82 },
];

export const PatientStatsChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorTreatments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '12px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="scans"
            name="AI Scans"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScans)"
          />
          <Area
            type="monotone"
            dataKey="treatments"
            name="Completed Treatments"
            stroke="#14B8A6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTreatments)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
