import axios from "axios";

const inventoryApi = axios.create({
  baseURL: import.meta.env.VITE_INVENTORY_API || "http://localhost:8050",
  timeout: 10000,
});

export default inventoryApi;
