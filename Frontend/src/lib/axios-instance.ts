import axios from "axios";
import { BASE_URL } from "../constants/api-paths";

const axiosInstance = axios.create({
  // Prefer explicit API base; fall back to local backend to avoid proxy issues.
  baseURL: BASE_URL || "",
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
  // We send JWT via Authorization header, so no cookies/credentials are needed.
  // Leaving withCredentials disabled avoids CORS issues with wildcard origins.
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error globally
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("vite-ui-theme");

        // Redirect to login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        alert(
          "500 says: " +
            (error.response.data?.message || "Internal Server Error"),
        );
      }
    } else if (error.code === "ECONNABORTED") {
      alert("Request timed out. Please try again.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
