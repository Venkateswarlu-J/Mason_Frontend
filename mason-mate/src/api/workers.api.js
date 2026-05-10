import api from "./axiosInstance";

export const getAllWorkers = ()      => api.get("/getAllWorkers");
export const addWorker    = (data)  => api.post("/addWorker", data); 
export const removeWorker = (id)    => api.delete(`/removeWorker/${id}`);
export const getWorkers    = ()    => api.get("/getWorkers");
export const updateWorker = (id,data)  => api.put(`updateWorker/${id}`,data);
export const getRemovedWorkers = () => api.get("/getRemovedWorkers");