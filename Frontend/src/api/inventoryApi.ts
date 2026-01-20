import axios from "axios";

const inventoryApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8050/stock/api",
  timeout: 10000,
});

export default inventoryApi;
