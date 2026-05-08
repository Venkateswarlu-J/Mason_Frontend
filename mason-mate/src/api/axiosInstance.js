import axios from "axios";
import BASE_URL from "./config";

const api = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("In axios::",token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // if (err.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("supervisor");
    //   // window.location.href = "/login";
    // }
    return Promise.reject(err);
  }
);

export default api;
