import React from 'react';
import { Badge } from '../common/Badge';

interface DentalTeethChartProps {
  affectedTeeth: number[];
  selectedTooth?: number | null;
  onSelectTooth?: (toothNumber: number) => void;
}

export const DentalTeethChart: React.FC<DentalTeethChartProps> = ({
  affectedTeeth = [],
  selectedTooth = null,
  onSelectTooth,
}) => {
  // Adult permanent dental numbering (1-16 Upper Arch, 17-32 Lower Arch)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1); // 1-16
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i); // 32 down to 17

  const renderToothIcon = (num: number) => {
    const isAffected = affectedTeeth.includes(num);
    const isSelected = selectedTooth === num;

    return (
      <button
        key={num}
        type="button"
        onClick={() => onSelectTooth && onSelectTooth(num)}
        className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all duration-200 ${
          isSelected
            ? 'bg-primary-50 dark:bg-primary-950/70 border-primary ring-2 ring-primary scale-105'
            : isAffected
            ? 'bg-red-50 dark:bg-red-950/60 border-red-400 dark:border-red-600 animate-pulse'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700/60'
        }`}
      >
        <div
          className={`w-7 h-9 rounded-md flex items-center justify-center font-bold text-xs transition-colors ${
            isAffected
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:bg-primary group-hover:text-white'
          }`}
        >
          {num}
        </div>
        <span className="text-[10px] text-slate-400 font-mono mt-1">
          {num <= 16 ? `U${num}` : `L${num}`}
        </span>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
          <div className="bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg">
            Tooth #{num} {isAffected ? '⚠️ Issue Detected' : 'Healthy'}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">FDI Permanent Dental Chart</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Interactive 32 Tooth Map</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-600 dark:text-red-400 font-semibold">Affected Pathology</span>
          </div>
        </div>
      </div>

      {/* Upper Arch (Maxilla) */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
          Upper Arch (Maxillary Teeth 1 - 16)
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
          {upperTeeth.map(renderToothIcon)}
        </div>
      </div>

      {/* Arch Separator Line */}
      <div className="relative my-4 border-t border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
        <span className="absolute bg-slate-100 dark:bg-slate-800 px-3 text-[10px] font-bold text-slate-400 uppercase">
          Occlusal Plane Line
        </span>
      </div>

      {/* Lower Arch (Mandible) */}
      <div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
          Lower Arch (Mandibular Teeth 17 - 32)
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
          {lowerTeeth.map(renderToothIcon)}
        </div>
      </div>
    </div>
  );
};
