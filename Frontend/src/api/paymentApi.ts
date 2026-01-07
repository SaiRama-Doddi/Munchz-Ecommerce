import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:9092", // PAYMENT SERVICE
  headers: {
    "Content-Type": "application/json",
  },
});

export default paymentApi;
/* ---------- PAYMENT ---------- */