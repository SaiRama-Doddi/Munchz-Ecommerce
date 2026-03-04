import axios from "axios";

const inventoryApi = axios.create({
  baseURL: "/stock/api",
  timeout: 10000,
});

export default inventoryApi;
