import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' ? '/api/v1' : 'http://localhost:3000/api/v1');

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

