import axios from "axios";

const paymentApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||"http://localhost:9092", // PAYMENT SERVICE
  headers: {
    "Content-Type": "application/json",
  },
});

export default paymentApi;
/* ---------- PAYMENT ---------- */