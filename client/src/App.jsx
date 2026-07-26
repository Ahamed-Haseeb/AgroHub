import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Storefront from './pages/Storefront';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BuyerMarketplace from './pages/buyer/BuyerMarketplace';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRole="farmer" />}>
            <Route path="/farmer" element={<FarmerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="buyer" />}>
            <Route path="/buyer" element={<BuyerMarketplace />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Storefront />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-white)',
              color: 'var(--text-heading)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'var(--font)',
              fontSize: '14px',
              boxShadow: 'var(--shadow-lg)',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
