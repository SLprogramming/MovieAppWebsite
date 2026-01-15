import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SOCKET_MESSAGE_URL + "/api/", // e.g. http://localhost:5000/api
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (optional)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors globally
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
