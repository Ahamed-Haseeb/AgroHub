import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('agrohub_token');
      sessionStorage.removeItem('agrohub_token');
      localStorage.removeItem('agrohub_user');
      sessionStorage.removeItem('agrohub_user');
      localStorage.removeItem('token');
      
      toast.success('Logged out successfully', { duration: 3000 });
      setTimeout(() => {
        if (window.location.pathname.includes('/farmer') || window.location.pathname.includes('/buyer')) {
          window.location.href = '/login';
        }
      }, 300);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
