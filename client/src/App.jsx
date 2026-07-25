import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Storefront from './pages/Storefront';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BuyerMarketplace from './pages/buyer/BuyerMarketplace';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerMarketplace />} />
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
  );
}
