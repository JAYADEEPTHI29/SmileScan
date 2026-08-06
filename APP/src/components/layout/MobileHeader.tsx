import React from 'react';
import { Sparkles, Sun, Moon, Bell } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';

export const MobileHeader: React.FC = () => {
  const { user } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-sm font-extrabold text-white tracking-tight block">SmileScan</span>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">AI Mobile Center</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-400" />}
        </button>
        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </button>
        {user?.photoUrl && (
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-8 h-8 rounded-xl object-cover border border-slate-700"
          />
        )}
      </div>
    </header>
  );
};
