import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Storefront from './pages/Storefront';
import FarmerDashboard from './pages/farmer/FarmerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/farmer" element={<FarmerDashboard />} />
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
