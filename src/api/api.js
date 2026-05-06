import axios from "axios";

const api = axios.create({
  baseURL: "http://cbt-backend.test/api/v1"
});

// 🔥 AUTO ATTACH TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;