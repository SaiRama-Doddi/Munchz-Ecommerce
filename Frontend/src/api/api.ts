// src/api/api.ts
import axios from "axios";

const API = axios.create({
  baseURL:"http://localhost:8081",
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

/* ---------- PROFILE ---------- */

export const updateProfileApi = (data: {
  firstName: string;
  lastName: string;
  mobile: string;
}) =>
  API.put("/auth/profile", data, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });


  export const patchProfileApi = (data: Partial<{
  firstName: string;
  lastName: string;
  mobile: string;
}>) =>
  API.patch("/auth/profile", data, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

/* ---------- GOOGLE AUTH ---------- */

export const googleRegister = (idToken: string) =>
  API.post("/auth/register/google", { idToken });

export const googleLogin = (idToken: string) =>
  API.post("/auth/login/google", { idToken });



export const listAddressesApi = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject("No token found");
  }

  return API.get("/auth/address", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const addAddressApi = (data: any) =>
  API.post("/auth/address", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },

  });


  /* ---------- ADDRESS : UPDATE ---------- */

export const updateAddressApi = (addressId: string, data: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject("No token found");
  }

  return API.put(`/auth/address/${addressId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


/* ---------- ADDRESS : DELETE ---------- */

export const deleteAddressApi = (addressId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject("No token found");
  }

  return API.delete(`/auth/address/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfileApi = () =>
  API.get("/auth/profile", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

