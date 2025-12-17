// src/api/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------- AUTH ---------- */

export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) => API.post("/auth/register", data);

/* ---------- OTP (existing) ---------- */

export const sendLoginOtp = (email: string) =>
  API.post("/auth/login-otp", { email });

export const confirmLoginOtp = (email: string, otp: string) =>
  API.post("/auth/login-otp/confirm", { email, otp });

export const sendResendOtp = (email: string) =>
  API.post("/auth/resend-otp", {
    email,
    purpose: "login",
  });

export const confirmResendOtp = (email: string, otp: string) =>
  API.post("/auth/resend-otp/confirm", {
    email,
    otp,
    purpose: "login",
  });

export default API;


/* ---------- PROFILE ---------- */

export const updateProfileApi = (data: any) =>
  axios.post("/profile/update", data, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });


