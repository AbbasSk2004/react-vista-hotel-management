import axios from 'axios';

const api = axios.create({
  // Safely fallback to local port 5000 if VITE_API_URL env is missing
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // Cleaned leading slashes to prevent url formatting oddities
  login: (email, password) => api.post('auth/login', { email, password }),
  me: () => api.get('auth/me'),
};

export const roomsApi = {
  getAll: (params) => api.get('rooms', { params }),
  create: (data) => api.post('rooms', data),
  update: (id, data) => api.put(`rooms/${id}`, data),
  remove: (id) => api.delete(`rooms/${id}`),
};

export const guestsApi = {
  getAll: (search) => api.get('guests', { params: { search } }),
  getById: (id) => api.get(`guests/${id}`),
  create: (data) => api.post('guests', data),
};

export const reservationsApi = {
  getAll: (params) => api.get('reservations', { params }),
  create: (data) => api.post('reservations', data),
  checkIn: (id) => api.put(`reservations/${id}/checkin`),
  checkOut: (id, data) => api.put(`reservations/${id}/checkout`, data),
};

export const invoicesApi = {
  getByReservation: (reservationId) => api.get(`invoices/${reservationId}`),
};

export const reportsApi = {
  getSummary: () => api.get('reports/summary'),
};

export const staffApi = {
  getAll: () => api.get('staff'),
  create: (data) => api.post('staff', data),
  update: (id, data) => api.put(`staff/${id}`, data),
  remove: (id) => api.delete(`staff/${id}`),
};

export default api;