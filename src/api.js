import axios from "axios";

const API = axios.create({
  baseURL: "https://quiz-backend-dz0i.onrender.com/api",
});

// ✅ Attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Handle expiry / invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default API;
