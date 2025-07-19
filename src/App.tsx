import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SubscriptionManager } from './components/subscription/SubscriptionManager';
import { AdminPanel } from './components/admin/AdminPanel';
import { ReportsPage } from './components/reports/ReportsPage';
import { Header } from './components/layout/Header';
import { AuthModal } from './components/auth/AuthModal';

function AppContent() {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                <>
                  <Header onAuthModalOpen={() => setAuthModalOpen(true)} />
                  <Dashboard />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/subscription" 
            element={
              currentUser ? (
                <>
                  <Header onAuthModalOpen={() => setAuthModalOpen(true)} />
                  <SubscriptionManager />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              currentUser ? (
                <>
                  <Header onAuthModalOpen={() => setAuthModalOpen(true)} />
                  <ReportsPage />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              currentUser ? (
                <>
                  <Header onAuthModalOpen={() => setAuthModalOpen(true)} />
                  <AdminPanel />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;