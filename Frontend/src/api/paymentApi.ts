/* import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:8080/payment", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default paymentApi; */
/* ---------- PAYMENT ---------- */
import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:8080/payment",
});

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default paymentApi;