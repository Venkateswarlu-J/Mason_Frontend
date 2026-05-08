import api from "./axiosInstance";

export const getAllWorkers = ()      => api.get("/getWorkers");
export const addWorker    = (data)  => api.post("/addWorker", data); 
export const removeWorker = (id)    => api.delete(`/removeWorker/${id}`);
export const getWorker    = (id)    => api.get(`/workers/${id}`);