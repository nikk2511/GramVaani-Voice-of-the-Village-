import axios from 'axios';

// Use relative URL in browser, or environment variable if set
const getAPIUrl = () => {
  // If NEXT_PUBLIC_API_URL is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In browser, always use relative URL
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  
  // Server-side fallback
  return 'http://localhost:3000/api/v1';
};

const api = axios.create({
  baseURL: getAPIUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      error.message = `Unable to connect to API at ${error.config?.baseURL || 'server'}. Please check if the server is running and the API routes are accessible.`;
    } else if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // Request made but no response
      error.message = 'No response from server. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const getDistricts = async (stateCode) => {
  const response = await api.get('/districts', { params: { state: stateCode } });
  return response.data;
};

export const getDistrictSummary = async (districtId, month = null) => {
  const params = month ? { month } : {};
  const response = await api.get(`/districts/${districtId}/summary`, { params });
  return response.data;
};

export const getDistrictMetrics = async (districtId, from = null, to = null) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const response = await api.get(`/districts/${districtId}/metrics`, { params });
  return response.data;
};

export const compareDistricts = async (district1, district2, metric = 'expenditure', from = null, to = null) => {
  const params = { district1, district2, metric };
  if (from) params.from = from;
  if (to) params.to = to;
  const response = await api.get('/compare', { params });
  return response.data;
};

export const getStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};

export default api;

