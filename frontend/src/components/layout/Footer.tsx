import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>© 2026 SmileScan AI Dental Clinical Decision Support System. Enterprise Medical Grade.</p>
      <div className="flex items-center gap-4">
        <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
        <a href="#terms" className="hover:text-primary transition-colors">HIPAA Compliance</a>
        <a href="#support" className="hover:text-primary transition-colors">Support</a>
      </div>
    </footer>
  );
};
