import api from "./axiosInstance";
export const getTodayAttendance  = ()     => api.get("/attendance/today");
export const submitAttendance    = (data) => api.post("/attendance", data);
export const getAttendanceByDate = (date) => api.get(`/attendance?date=${date}`);
