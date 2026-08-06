import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const id = `notif_${Date.now()}`;
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs w-full pointer-events-none">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-3 rounded-xl border text-xs shadow-xl backdrop-blur-md pointer-events-auto transition-all ${
              n.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                : n.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : n.type === 'warning'
                ? 'bg-amber-950/90 border-amber-800 text-amber-200'
                : 'bg-blue-950/90 border-blue-800 text-blue-200'
            }`}
          >
            <div className="font-bold mb-0.5">{n.title}</div>
            <div className="text-[11px] opacity-90">{n.message}</div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationContext must be used within NotificationProvider');
  return context;
};
