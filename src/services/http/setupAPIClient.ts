"use client";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { AuthTokenError } from "./error/AuthTokenError";

export function setupAPIClient() {
  let token = Cookies.get("nextauth.token");

  const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error?.response?.status === 401) {
        Cookies.remove("nextauth.token");
        return Promise.reject(new AuthTokenError());
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}
