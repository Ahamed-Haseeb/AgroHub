import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Storefront from './pages/Storefront';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BuyerMarketplace from './pages/buyer/BuyerMarketplace';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute allowedRole="farmer" />}>
              <Route path="/farmer" element={<FarmerDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRole="buyer" />}>
              <Route path="/buyer" element={<BuyerMarketplace />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<><Navbar /><CheckoutPage /><Footer /></>} />
              <Route path="/order-confirmation/:id" element={<><Navbar /><OrderConfirmation /><Footer /></>} />
            </Route>

            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Storefront />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>

          <Toaster
            position="bottom-right"
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
              duration:10000,
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
