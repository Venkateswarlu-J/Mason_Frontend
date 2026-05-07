/* src/api/client.js
   Central HTTP client. All requests go through here.
   Base URL is read from .env so switching from localhost → Render
   only requires changing REACT_APP_API_BASE_URL. */

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9090';

function getToken() {
  return localStorage.getItem('mm_token');
}

async function request(method, path, body = null, requiresAuth = true) {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401) {
    localStorage.removeItem('mm_token');
    window.location.href = '/login';
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || data.error || 'Something went wrong';
    throw new Error(message);
  }

  return data;
}

export const api = {
  get:    (path, auth = true)         => request('GET',    path, null, auth),
  post:   (path, body, auth = true)   => request('POST',   path, body, auth),
  put:    (path, body, auth = true)   => request('PUT',    path, body, auth),
  delete: (path, auth = true)         => request('DELETE', path, null, auth),
};
