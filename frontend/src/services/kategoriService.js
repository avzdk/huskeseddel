/**
 * Kategori API service
 */
import apiClient from './api.js';

export const kategoriService = {
  // Hent alle kategorier
  getAll: async () => {
    const response = await apiClient.get('/kategorier');
    return response.data;
  },

  // Hent en specifik kategori
  getById: async (id) => {
    const response = await apiClient.get(`/kategorier/${id}`);
    return response.data;
  },

  // Opret ny kategori
  create: async (data) => {
    const response = await apiClient.post('/kategorier', data);
    return response.data;
  },

  // Opdater kategori
  update: async (id, data) => {
    const response = await apiClient.put(`/kategorier/${id}`, data);
    return response.data;
  },

  // Slet kategori
  delete: async (id) => {
    const response = await apiClient.delete(`/kategorier/${id}`);
    return response.data;
  },
};