import api from "./axiosInstance";
export const getAllProjects = ()          => api.get("/getAllProjects");
export const addProject    = (data)      => api.post("/addProject", data);
export const getProject    = (id)        => api.get(`/projects/${id}`);
export const updateProject = (id, data)  => api.put(`/updateProjDetails/${id}`, data);
export const updateStatus = (id)        => api.put(`/updateStatus/${id}`);
