import axios from "axios";

const orderApi = axios.create({
  baseURL: "http://localhost:9090", // ORDER-SERVICE
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ADD THIS INTERCEPTOR
orderApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT from login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default orderApi;