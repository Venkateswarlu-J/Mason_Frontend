/* src/api/services.js
   One function per backend endpoint.
   Import only what you need in each component. */

import { api } from './client';

/* ── Auth ─────────────────────────────────────────── */
export const authService = {
  register:       (data)  => api.post('/api/auth/register',        data,  false),
  sendOtp:        (email) => api.post('/api/auth/send-otp',        { email }, false),
  verifyOtp:      (data)  => api.post('/api/auth/verify-otp',      data,  false),
  setPassword:    (data)  => api.post('/api/auth/set-password',    data,  false),
  login:          (data)  => api.post('/api/auth/login',           data,  false),
};

/* ── Supervisor ───────────────────────────────────── */
export const supervisorService = {
  getProfile: () => api.get('/api/supervisor/profile'),
};

/* ── Workers ──────────────────────────────────────── */
export const workerService = {
  getAll:   ()     => api.get('/api/workers'),
  getById:  (id)   => api.get(`/api/workers/${id}`),
  create:   (data) => api.post('/api/workers', data),
  update:   (id, data) => api.put(`/api/workers/${id}`, data),
  remove:   (id)   => api.delete(`/api/workers/${id}`),
};

/* ── Projects ─────────────────────────────────────── */
export const projectService = {
  getAll:  ()     => api.get('/api/projects'),
  getById: (id)   => api.get(`/api/projects/${id}`),
  create:  (data) => api.post('/api/projects', data),
  update:  (id, data) => api.put(`/api/projects/${id}`, data),
  remove:  (id)   => api.delete(`/api/projects/${id}`),
};

/* ── Attendance ───────────────────────────────────── */
export const attendanceService = {
  getToday:  ()     => api.get('/api/attendance/today'),
  getByDate: (date) => api.get(`/api/attendance?date=${date}`),
  submit:    (data) => api.post('/api/attendance', data),
  reset:     ()     => api.post('/api/attendance/reset'),
};

/* ── Payment ──────────────────────────────────────── */
export const paymentService = {
  getSummary:     ()     => api.get('/api/payments/summary'),
  getByWorker:    (id)   => api.get(`/api/payments/worker/${id}`),
  processPayment: (data) => api.post('/api/payments', data),
};
