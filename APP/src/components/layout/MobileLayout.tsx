import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';

export const MobileLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto relative shadow-2xl border-x border-slate-900">
      <MobileHeader />
      <main className="flex-1 px-4 py-4 mb-20 overflow-y-auto">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
};
