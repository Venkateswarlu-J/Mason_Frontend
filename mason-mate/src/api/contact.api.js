import api from "./axiosInstance";
export const sendMail      = async(data)     => api.post("/send",data);