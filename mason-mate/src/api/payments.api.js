import api from "./axiosInstance";
export const getPayments      = ()     => api.get("/payments");
export const makePayment      = (data) => api.post("/payments", data);
export const getWeeklySummary = ()     => api.get("/payments/weekly-summary");
