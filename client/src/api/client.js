import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchCrops = async (params = {}) => {
  const { data } = await api.get("/crops", { params });
  return data;
};

export const fetchCropById = async (id) => {
  const { data } = await api.get(`/crops/${id}`);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await api.get("/dashboard/orders");
  return data;
};

export const fetchAlerts = async () => {
  const { data } = await api.get("/dashboard/alerts");
  return data;
};

export const fetchAdvisory = async () => {
  const { data } = await api.get("/dashboard/advisory");
  return data;
};

export const fetchPrediction = async (cropId) => {
  const { data } = await api.get(`/ai/predictions/${cropId}`);
  return data;
};

export const fetchAvailableCrops = async () => {
  const { data } = await api.get("/ai/crops");
  return data;
};

export const fetchStats = async () => {
  const { data } = await api.get("/stats");
  return data;
};

export const fetchMarketPrices = async () => {
  const { data } = await api.get("/market/prices");
  return data;
};

export const fetchTraceability = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}/traceability`);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const createOrder = (orderData) => api.post('/orders', orderData).then(r => r.data);
export const fetchMyOrders = () => api.get('/orders/mine').then(r => r.data);
export const fetchFarmerOrders = () => api.get('/orders/farmer').then(r => r.data);
export const fetchOrderById = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status }).then(r => r.data);

export default api;
