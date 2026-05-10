import api from "./axiosInstance";
export const getTodayAttendance  = ()     => api.get("/attendance/today");
export const submitAttendance    = (data) => api.post("/attendance", data);
export const markAttendance    = (data) => api.post("/attendance", data);
export const getAttendanceByDate = (date) => api.get(`/attendance?date=${date}`);
export const getWeeklyAttendance = (date) => api.get(`/attendance?date=${date}`);
