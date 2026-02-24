// src/api/offlineInventoryApi.ts
import axios from "axios";

const offlineInventoryApi = axios.create({
  baseURL: "http://localhost:8080/stock/api/admin",
});

export default offlineInventoryApi;
