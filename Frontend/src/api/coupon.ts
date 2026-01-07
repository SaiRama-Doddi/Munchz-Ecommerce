import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8060/api", // ✅ VERY IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
