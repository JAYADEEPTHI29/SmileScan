import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Camera, FileText, User, Settings } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/scan/new', label: 'Scan', icon: Camera, isPrimary: true },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          if (item.isPrimary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/40 text-white border-2 border-slate-950 active:scale-95 transition-transform">
                  <Icon size={22} />
                </div>
                <span className="text-[10px] font-bold text-primary mt-0.5">{item.label}</span>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                  isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
