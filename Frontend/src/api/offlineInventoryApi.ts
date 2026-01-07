// src/api/offlineInventoryApi.ts
import axios from "axios";

const offlineInventoryApi = axios.create({
  baseURL: "http://localhost:8050/api/admin",
});

export default offlineInventoryApi;
