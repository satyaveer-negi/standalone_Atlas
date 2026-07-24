// src/api/axios.ts

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8001/api/",
  withCredentials: true,
});

// ============================
// REQUEST INTERCEPTOR
// ============================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================
// RESPONSE INTERCEPTOR (🔥 AUTO REFRESH)
// ============================

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔥 Only handle 401 + not retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          (import.meta.env.VITE_API_URL || "http://127.0.0.1:8001/api/") + "auth/refresh/",
          {},
          { withCredentials: true },
        );

        const newAccess = res.data.access;

        // 🔥 Save new token
        localStorage.setItem("access", newAccess);

        API.defaults.headers.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        // 🔁 retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🔥 logout on refresh failure
        localStorage.removeItem("access");

        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;

// import axios from "axios";
// import toast from "react-hot-toast";
// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
// });

// // Attach JWT token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access");

//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // src/api/axios.ts

// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     toast.error(err.response?.data?.detail || "Something went wrong");
//     return Promise.reject(err);
//   }
// );

// export default API;

// // // src/api/axios.ts

// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "http://127.0.0.1:8000/api/",
// // });

// // // 🔥 Attach token automatically
// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("access");

// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }

// //   return config;
// // });

// // export default API;
