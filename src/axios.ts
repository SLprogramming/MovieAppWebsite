import axios, { AxiosError } from "axios";
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios"

const api: AxiosInstance = axios.create({
  baseURL: "https://movieappbackend-lc3u.onrender.com/api/",
  timeout: 10000,
  withCredentials: true, // cookies included automatically
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        // Call refresh API; cookie automatically sent
        await api.get("auth/refreshtoken"); 
        processQueue(null);
        return api(originalRequest); // Retry original request
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
