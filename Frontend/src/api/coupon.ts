import axios from "axios";

const api = axios.create({
  baseURL: "/coupon/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
