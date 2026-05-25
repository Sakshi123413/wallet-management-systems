import api from './api';

/**
 * Currency Service
 * Handles all currency operations
 */

// Get all currencies
export const getCurrencies = async () => {
  const response = await api.get('/api/currencies');
  return response.data;
};

// Get currency by ID
export const getCurrencyById = async (id) => {
  const response = await api.get(`/api/currencies/${id}`);
  return response.data;
};

// Create new currency
export const createCurrency = async (currencyData) => {
  const response = await api.post('/api/currencies', currencyData);
  return response.data;
};

export default {
  getCurrencies,
  getCurrencyById,
  createCurrency,
};
