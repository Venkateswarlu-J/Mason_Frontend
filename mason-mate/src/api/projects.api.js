import api from "./axiosInstance";
export const getAllProjects = ()          => api.get("/projects");
export const addProject    = (data)      => api.post("/projects", data);
export const getProject    = (id)        => api.get(`/projects/${id}`);
export const updateProject = (id, data)  => api.put(`/projects/${id}`, data);
export const deleteProject = (id)        => api.delete(`/projects/${id}`);
