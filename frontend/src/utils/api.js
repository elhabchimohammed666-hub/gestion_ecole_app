const BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Stats
  getDashboardStats: (month) => apiRequest(`/stats/dashboard${month ? `?month=${encodeURIComponent(month)}` : ''}`),

  // Students
  getStudents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/students${q ? `?${q}` : ''}`);
  },
  getDepartedStudents: () => apiRequest('/students/departed'),
  getStudent: (id) => apiRequest(`/students/${id}`),
  createStudent: (data) => apiRequest('/students', { method: 'POST', body: data }),
  updateStudent: (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: data }),
  markDeparted: (id, departureReason) => apiRequest(`/students/${id}/depart`, { method: 'PUT', body: { departureReason } }),
  reEnrollStudent: (id) => apiRequest(`/students/${id}/re-enroll`, { method: 'PUT' }),
  deleteStudent: (id) => apiRequest(`/students/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/payments${q ? `?${q}` : ''}`);
  },
  recordPayment: (id, data) => apiRequest(`/payments/${id}`, { method: 'PUT', body: data }),
  getReceipt: (id) => apiRequest(`/payments/receipt/${id}`),

  // Teachers
  getTeachers: () => apiRequest('/teachers'),
  getTeacherStudents: (id) => apiRequest(`/teachers/${id}/students`),
  createTeacher: (data) => apiRequest('/teachers', { method: 'POST', body: data }),
  updateTeacher: (id, data) => apiRequest(`/teachers/${id}`, { method: 'PUT', body: data }),
  deleteTeacher: (id) => apiRequest(`/teachers/${id}`, { method: 'DELETE' }),

  // Expenses
  getExpenses: (month) => apiRequest(`/expenses${month ? `?month=${encodeURIComponent(month)}` : ''}`),
  createExpense: (data) => apiRequest('/expenses', { method: 'POST', body: data }),
  deleteExpense: (id) => apiRequest(`/expenses/${id}`, { method: 'DELETE' }),

  // Attendances
  getAttendances: (date) => apiRequest(`/attendances${date ? `?date=${encodeURIComponent(date)}` : ''}`),
  createAttendance: (data) => apiRequest('/attendances', { method: 'POST', body: data }),
  deleteAttendance: (id) => apiRequest(`/attendances/${id}`, { method: 'DELETE' }),

  // Timetable
  getTimetable: () => apiRequest('/timetable'),
  createSession: (data) => apiRequest('/timetable', { method: 'POST', body: data }),
  updateSession: (id, data) => apiRequest(`/timetable/${id}`, { method: 'PUT', body: data }),
  deleteSession: (id) => apiRequest(`/timetable/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => apiRequest('/settings'),
  updateSettings: (data) => apiRequest('/settings', { method: 'PUT', body: data })
};
