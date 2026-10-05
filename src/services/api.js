/**
 * SAHAYAK Centralized API Service Layer
 * Connects the React frontend to the FastAPI backend.
 * Provides resilient fallback to local data if the server is offline.
 */
import {
  FALLBACK_STUDENT,
  FALLBACK_SCHOLARSHIPS,
  FALLBACK_APPLICATION,
  FALLBACK_DOCUMENTS,
  FALLBACK_PAYMENTS,
  FALLBACK_NOTIFICATIONS
} from './fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Generic request helper with error handling and fallback
 */
async function request(endpoint, options = {}, fallback = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || errorData.message || `HTTP error ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (err) {
    if (fallback !== null) {
      console.info(`[API] Fallback activated for ${endpoint} (${err.message})`);
      return fallback;
    }
    throw err;
  }
}

export const api = {
  /**
   * Student API
   */
  async getStudent() {
    return request('/student', {}, FALLBACK_STUDENT);
  },

  /**
   * Scholarships API
   * @param {string} [category] - 'all', 'school', 'college', 'fellowship'
   */
  async getScholarships(category = 'all') {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    const filteredFallback = (!category || category === 'all')
      ? FALLBACK_SCHOLARSHIPS
      : FALLBACK_SCHOLARSHIPS.filter(s => s.category.toLowerCase() === category.toLowerCase());

    return request(`/scholarships${query}`, {}, filteredFallback);
  },

  /**
   * Scholarship Details by ID
   * @param {string} id - e.g. 'mota-post-matric'
   */
  async getScholarshipById(id) {
    const fallbackItem = FALLBACK_SCHOLARSHIPS.find(s => s.id.toLowerCase() === id.toLowerCase()) || FALLBACK_SCHOLARSHIPS[1];
    return request(`/scholarships/${encodeURIComponent(id)}`, {}, fallbackItem);
  },

  /**
   * Applications List
   */
  async getApplications() {
    return request('/applications', {}, [FALLBACK_APPLICATION]);
  },

  /**
   * Application Details & 6-stage Tracker by ID
   * @param {string} id - e.g. 'MOTA-PMS-2026-00124'
   */
  async getApplicationById(id) {
    return request(`/applications/${encodeURIComponent(id)}`, {}, FALLBACK_APPLICATION);
  },

  /**
   * Document Wallet & DigiLocker state
   */
  async getDocuments() {
    return request('/documents', {}, FALLBACK_DOCUMENTS);
  },

  /**
   * Payment & DBT status
   */
  async getPayments() {
    return request('/payments', {}, FALLBACK_PAYMENTS);
  },

  /**
   * Notifications list
   * @param {string} [category] - 'all', 'deadlines', 'status', 'payments', 'system'
   */
  async getNotifications(category = 'all') {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    const filteredFallback = (!category || category === 'all')
      ? FALLBACK_NOTIFICATIONS
      : FALLBACK_NOTIFICATIONS.filter(n => n.category.toLowerCase() === category.toLowerCase());

    return request(`/notifications${query}`, {}, filteredFallback);
  },

  /**
   * JAGO AI Chat Assistant
   * @param {Object} params
   * @param {string} params.message - Question or chip text
   * @param {string} [params.applicationId] - Current active application ID
   * @param {string} [params.scholarshipId] - Current scholarship ID if from details
   */
  async chatWithJago({ message, applicationId = 'MOTA-PMS-2026-00124', scholarshipId = null, language = 'en', history = [] }) {
    return request('/jago/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        application_id: applicationId,
        scholarship_id: scholarshipId,
        language,
        history,
      }),
    }, {
      response: `Namaste Ramesh Kumar. Your application for Post-Matric Scholarship is currently in Sanction. Your pending amount of ₹5,000 for September is under verification. Please renew your expired Income Certificate in your Document Wallet to prevent any delays.`,
      reply: `Namaste Ramesh Kumar. Your application for Post-Matric Scholarship is currently in Sanction. Your pending amount of ₹5,000 for September is under verification. Please renew your expired Income Certificate in your Document Wallet to prevent any delays.`,
      context_used: {
        student_name: "Ramesh Kumar",
        application_id: applicationId,
        current_stage: "Sanction",
        pending_amount: 5000,
        action_required: "Income certificate renewal"
      },
      source: "local_grounded_fallback"
    });
  },
};

export default api;
