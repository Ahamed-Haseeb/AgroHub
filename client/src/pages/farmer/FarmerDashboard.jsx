import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Leaf, LayoutDashboard, BarChart2, Package,
  LogOut, Sprout, Settings, TrendingUp, ClipboardList, Menu
} from 'lucide-react';

import {
  fetchPrediction, fetchAdvisory, fetchAlerts,
  fetchAvailableCrops, fetchFarmerOrders, fetchMarketPrices,
  fetchCrops, updateOrderStatus
} from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

import OverviewTab from './tabs/OverviewTab';
import AdvisorTab from './tabs/AdvisorTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import OrdersTab from './tabs/OrdersTab';
import InventoryTab from './tabs/InventoryTab';
import ListingsTab from './tabs/ListingsTab';
import SettingsTab from './tabs/SettingsTab';

const getCropColor = (name) => {
  const palettes = [
    { bg: 'rgba(234, 88, 12, 0.1)', text: '#ea580c' },
    { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' },
    { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb' },
    { bg: 'rgba(22, 163, 74, 0.1)', text: '#16a34a' },
    { bg: 'rgba(217, 119, 6, 0.1)', text: '#d97706' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
};

const getInitials = (name) => {
  const parts = name.split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'advisor', label: 'Crops', icon: <Sprout size={18} /> },
  { id: 'forecast', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { id: 'alerts', label: 'Orders', icon: <ClipboardList size={18} /> },
  { id: 'packaging', label: 'Inventory', icon: <Package size={18} /> },
  { id: 'my-listings', label: 'Market', icon: <TrendingUp size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function FarmerDashboard() {
  const { user: currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCrop, setSelectedCrop] = useState('ONION_BIG_LK');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: prediction } = useQuery({
    queryKey: ['prediction', selectedCrop],
    queryFn: () => fetchPrediction(selectedCrop),
  });

  const { data: cropPrices = [] } = useQuery({
    queryKey: ['marketPrices'],
    queryFn: fetchMarketPrices,
  });

  const { data: cropAdvisory = [] } = useQuery({
    queryKey: ['advisory'],
    queryFn: fetchAdvisory,
  });

  const { data: harvestAlerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
  });

  const { data: availableCrops = [] } = useQuery({
    queryKey: ['availableCrops'],
    queryFn: fetchAvailableCrops,
  });

  const { data: activeOrders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['farmerOrders'],
    queryFn: fetchFarmerOrders,
  });

  const { data: allCrops = [] } = useQuery({
    queryKey: ['crops'],
    queryFn: () => fetchCrops(),
  });
  const myListings = allCrops.filter(c => c.farmer_name === currentUser?.name);

  const wrappedUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update order status');
      throw err;
    }
  };

  return (
    <>
      <div className="dash-mobile-header">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf size={18} /> AgroHub
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="dash-mobile-menu-btn">
          <Menu size={20} />
        </button>
      </div>

      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
            <Leaf size={20} color="var(--bg-white)" />
            AgroHub
          </Link>

          <div className="sidebar-nav">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="sidebar-user">
            <div className="sidebar-avatar">{currentUser ? getInitials(currentUser.name) : 'SP'}</div>
            <div>
              <div className="sidebar-user-name">{currentUser ? currentUser.name : 'Loading...'}</div>
              <div className="sidebar-user-role">{currentUser ? currentUser.role : 'Farmer'}</div>
            </div>
          </div>

          <button className="sidebar-logout" onClick={() => {
            logout();
            window.location.href = '/login';
          }}>
            <LogOut size={16} />
            Log out
          </button>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <OverviewTab 
              cropPrices={cropPrices}
              prediction={prediction}
              activeOrders={activeOrders}
              myListings={myListings}
              updateOrderStatus={wrappedUpdateOrderStatus}
              refetchOrders={refetchOrders}
            />
          )}

          {activeTab === 'advisor' && (
            <AdvisorTab 
              cropAdvisory={cropAdvisory}
              getCropColor={getCropColor}
            />
          )}

          {activeTab === 'forecast' && (
            <AnalyticsTab 
              prediction={prediction}
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
              availableCrops={availableCrops}
            />
          )}

          {activeTab === 'alerts' && (
            <OrdersTab 
              harvestAlerts={harvestAlerts}
              activeOrders={activeOrders}
              updateOrderStatus={wrappedUpdateOrderStatus}
              refetchOrders={refetchOrders}
            />
          )}

          {activeTab === 'packaging' && (
            <InventoryTab />
          )}

          {activeTab === 'my-listings' && (
            <ListingsTab myListings={myListings} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab currentUser={currentUser} />
          )}
        </main>
      </div>
    </>
  );
}
