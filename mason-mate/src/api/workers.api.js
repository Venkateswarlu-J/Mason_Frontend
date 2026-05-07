import api from "./axiosInstance";
export const getAllWorkers = ()       => api.get("/workers");
export const addWorker    = (data)   => api.post("/workers", data);
export const removeWorker = (id)     => api.delete(`/workers/${id}`);
export const getWorker    = (id)     => api.get(`/workers/${id}`);
