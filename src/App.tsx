import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';

// Views
import { LandingPage } from './views/LandingPage.tsx';
import { TouristDashboard } from './views/TouristDashboard.tsx';
import { SafetyDashboardView } from './views/SafetyDashboardView.tsx';
import { SafetyMapView } from './views/SafetyMapView.tsx';
import { SaferRoutesView } from './views/SaferRoutesView.tsx';
import { EmergencyServicesView } from './views/EmergencyServicesView.tsx';
import { RecommendationsView } from './views/RecommendationsView.tsx';
import { PredictionHistoryView } from './views/PredictionHistoryView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { LoginPage } from './views/LoginPage.tsx';
import { RegisterPage } from './views/RegisterPage.tsx';
import { FeedbackView } from './views/FeedbackView.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<TouristDashboard />} />
              <Route path="/safety-dashboard/:id" element={<SafetyDashboardView />} />
              <Route path="/map" element={<SafetyMapView />} />
              <Route path="/routes" element={<SaferRoutesView />} />
              <Route path="/emergency" element={<EmergencyServicesView />} />
              <Route path="/recommendations" element={<RecommendationsView />} />
              <Route path="/history" element={<PredictionHistoryView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/admin" element={<AdminDashboardView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/feedback" element={<FeedbackView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
