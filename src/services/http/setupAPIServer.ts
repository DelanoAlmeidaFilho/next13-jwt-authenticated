"use server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

import { AuthTokenError } from "./error/AuthTokenError";

export async function setupAPIServer() {
  let token = cookies().get("nextauth.token")?.value;

  const apiServer = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  apiServer.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error?.response?.status === 401) {
        return Promise.reject(new AuthTokenError());
      }

      return Promise.reject(error);
    }
  );

  return apiServer;
}
