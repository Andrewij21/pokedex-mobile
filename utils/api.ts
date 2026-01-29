import axios, { type AxiosError } from "axios";
import { router } from "expo-router"; // Navigasi tanpa hooks
import * as SecureStore from "expo-secure-store"; // Penyimpanan token aman di HP

let authToken: string | null = null;

export const setToken = (token: string | null) => {
  authToken = token;
};

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("❌ Token Expired/Invalid. Logout user...");

      await SecureStore.deleteItemAsync("session_token");

      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  },
);
