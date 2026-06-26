import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BuyerMarketplace from './pages/buyer/BuyerMarketplace';
import './index.css';

function AppLayout() {
  const location = useLocation();
  const isFarmerDash = location.pathname.startsWith('/farmer');
  const showFooter = !isFarmerDash;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer"  element={<BuyerMarketplace />} />
      </Routes>
      {showFooter && <Footer />}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#0f1a12' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f1a12' },
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
