import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

const api = axios.create({
  baseURL: `${baseUrl.replace(/\/$/, "")}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

