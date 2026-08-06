import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ScanProvider } from './contexts/ScanContext';

import { MobileLogin } from './pages/auth/MobileLogin';
import { MobileRegister } from './pages/auth/MobileRegister';
import { MobileForgotPassword } from './pages/auth/MobileForgotPassword';
import { MobileLayout } from './components/layout/MobileLayout';
import { MobileDashboard } from './pages/dashboard/MobileDashboard';
import { MobilePatientList } from './pages/patients/MobilePatientList';
import { MobilePatientDetail } from './pages/patients/MobilePatientDetail';
import { MobileNewScan } from './pages/scan/MobileNewScan';
import { MobileScanResult } from './pages/scan/MobileScanResult';
import { MobileReportsList } from './pages/reports/MobileReportsList';
import { MobileDoctorProfile } from './pages/profile/MobileDoctorProfile';
import { MobileSettings } from './pages/settings/MobileSettings';

const ProtectedMobileRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold text-xs p-4">
        Loading SmileScan Mobile App...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ScanProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<MobileLogin />} />
                <Route path="/register" element={<MobileRegister />} />
                <Route path="/forgot-password" element={<MobileForgotPassword />} />

                {/* Mobile Main Layout Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedMobileRoute>
                      <MobileLayout />
                    </ProtectedMobileRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<MobileDashboard />} />
                  <Route path="patients" element={<MobilePatientList />} />
                  <Route path="patients/:id" element={<MobilePatientDetail />} />
                  <Route path="scan/new" element={<MobileNewScan />} />
                  <Route path="scan/result" element={<MobileScanResult />} />
                  <Route path="reports" element={<MobileReportsList />} />
                  <Route path="profile" element={<MobileDoctorProfile />} />
                  <Route path="settings" element={<MobileSettings />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </ScanProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
