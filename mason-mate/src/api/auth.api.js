import api from "./axiosInstance";
// export const registerSupervisor = (data)       => api.post("/auth/register", data);
// export const sendOtp             = (email)      => api.post("/auth/send-otp", { email });
// export const verifyOtp           = (email, otp) => api.post("/auth/verify-otp", { email, otp });
// export const createPassword      = (data)       => api.post("/auth/create-password", data);
// export const loginSupervisor     = (data)       => api.post("/auth/login", data);

export const registerSupervisor = (data)       => api.post("/register", data);
// export const sendOtp             = (email)      => api.post("/sendOTP", { email }); already defined in the register
export const verifyOtp           = (email, otp) => api.post("/verifyOTP", { email, otp });
export const createPassword      = (data)       => api.post("/createAccount", data);
export const loginSupervisor     = (data)       => api.post("/login", data);
