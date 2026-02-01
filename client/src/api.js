import axios from "axios";

const rawBase = import.meta.env.VITE_API_BASE_URL || "https://shope-lite.onrender.com";
const baseUrl = rawBase.replace(/\/+$/, ""); // remove trailing /

const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
