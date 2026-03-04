// src/api/offlineInventoryApi.ts
import axios from "axios";

const offlineInventoryApi = axios.create({
  baseURL: "/stock/api/admin",
});

export default offlineInventoryApi;
