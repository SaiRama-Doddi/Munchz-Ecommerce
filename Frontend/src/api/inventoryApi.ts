import axios from "axios";

const inventoryApi = axios.create({
  baseURL: "http://localhost:8080/stock/api",
  timeout: 10000,
});

export default inventoryApi;
