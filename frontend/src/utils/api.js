import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// CUSTOMER OPERATIONS
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  login: (email, password) => api.get('/customers', {
    params: { email, password }
  }),
};

// APPLICATION OPERATIONS
export const applicationAPI = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  getByCustomer: (customerId) => api.get('/applications', {
    params: { customerId }
  }),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  updateStatus: (id, status, notes) => api.patch(`/applications/${id}`, {
    status,
    notes,
    updatedAt: new Date().toISOString(),
  }),
};

// POLICY OPERATIONS
export const policyAPI = {
  getAll: () => api.get('/policies'),
  getById: (id) => api.get(`/policies/${id}`),
  getByCustomer: (customerId) => api.get('/policies', {
    params: { customerId }
  }),
  create: (data) => api.post('/policies', data),
  update: (id, data) => api.put(`/policies/${id}`, data),
};

// PRODUCT OPERATIONS
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// RISK ASSESSMENT OPERATIONS
export const riskAssessmentAPI = {
  getAll: () => api.get('/riskAssessments'),
  getById: (id) => api.get(`/riskAssessments/${id}`),
  getByCustomer: (customerId) => api.get('/riskAssessments', {
    params: { customerId }
  }),
  create: (data) => api.post('/riskAssessments', data),
  update: (id, data) => api.put(`/riskAssessments/${id}`, data),
};

// UNDERWRITING DECISION OPERATIONS
export const underwritingDecisionAPI = {
  getAll: () => api.get('/underwritingDecisions'),
  getById: (id) => api.get(`/underwritingDecisions/${id}`),
  getByApplication: (applicationId) => api.get('/underwritingDecisions', {
    params: { applicationId }
  }),
  create: (data) => api.post('/underwritingDecisions', data),
  update: (id, data) => api.put(`/underwritingDecisions/${id}`, data),
};

// PREMIUM PAYMENT OPERATIONS
export const premiumPaymentAPI = {
  getAll: () => api.get('/premiumPayments'),
  getById: (id) => api.get(`/premiumPayments/${id}`),
  getByPolicy: (policyId) => api.get('/premiumPayments', {
    params: { policyId }
  }),
  getByCustomer: (customerId) => api.get('/premiumPayments', {
    params: { customerId }
  }),
  create: (data) => api.post('/premiumPayments', data),
  update: (id, data) => api.put(`/premiumPayments/${id}`, data),
  recordPayment: (id, paymentData) => api.patch(`/premiumPayments/${id}`, {
    status: 'PAID',
    paymentDate: new Date().toISOString(),
    ...paymentData
  }),
};

// RISK REPORT OPERATIONS
export const riskReportAPI = {
  getAll: () => api.get('/riskReports'),
  getById: (id) => api.get(`/riskReports/${id}`),
  create: (data) => api.post('/riskReports', data),
};

// UNDERWRITER OPERATIONS
export const underwriterAPI = {
  login: (email, password) => {
    const underwriters = [
      { id: 1, email: 'underwriter@riskguard.com', password: 'underwriter123', name: 'Underwriter' }
    ];
    const user = underwriters.find(u => u.email === email && u.password === password);
    return user ? Promise.resolve({ data: user }) : Promise.reject(new Error('Invalid credentials'));
  }
};

// ADMIN OPERATIONS
export const adminAPI = {
  login: (email, password) => {
    const admins = [
      { id: 1, email: 'admin@riskguard.com', password: 'admin123', name: 'Administrator' }
    ];
    const user = admins.find(u => u.email === email && u.password === password);
    return user ? Promise.resolve({ data: user }) : Promise.reject(new Error('Invalid credentials'));
  }
};

export default api;
