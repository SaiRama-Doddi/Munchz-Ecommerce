// src/api/offlineInventoryApi.ts
import axios from "axios";

const offlineInventoryApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||"http://localhost:8050/api/admin",
});

export default offlineInventoryApi;
