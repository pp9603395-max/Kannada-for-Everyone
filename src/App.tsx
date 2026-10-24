import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Root redirector component based on authentication state
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF8F2] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-[#183B28] text-amber-200 flex items-center justify-center font-kannada font-bold text-3xl shadow-lg shadow-[#183B28]/20 animate-pulse mb-4">
          ಕ
        </div>
        <h2 className="font-serif font-bold text-xl text-[#183B28]">Kannada for Everyone</h2>
        <p className="font-kannada text-xs text-[#526056] mt-1">ಕನ್ನಡ ಎಲ್ಲರಿಗೂ</p>
        <div className="mt-6 flex items-center gap-2.5 text-xs text-[#526056] bg-white px-4 py-2.5 rounded-full border border-[#E6E0D5] shadow-xs">
          <span className="w-4 h-4 border-2 border-[#183B28] border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Dedicated Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Main Learning Website Route */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Root Path Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Explicit 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
