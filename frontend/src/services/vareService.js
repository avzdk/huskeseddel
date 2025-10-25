/**
 * Vare API service
 */
import apiClient from './api.js';

export const vareService = {
  // Hent varer med søgning og filtrering
  search: async (query = '', kategoriIds = []) => {
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.append('q', query);
    }
    
    kategoriIds.forEach(id => {
      params.append('kategori_id', id);
    });
    
    const url = `/varer?${params.toString()}`;
    console.log('API Call:', url, { query, kategoriIds }); // Debug log
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Hent alle varer
  getAll: async () => {
    const response = await apiClient.get('/varer');
    return response.data;
  },

  // Hent en specifik vare
  getById: async (id) => {
    const response = await apiClient.get(`/varer/${id}`);
    return response.data;
  },

  // Hent varer i en kategori
  getByKategori: async (kategoriId) => {
    const response = await apiClient.get(`/varer/kategori/${kategoriId}`);
    return response.data;
  },

  // Opret ny vare
  create: async (data) => {
    const response = await apiClient.post('/varer', data);
    return response.data;
  },

  // Opdater vare
  update: async (id, data) => {
    const response = await apiClient.put(`/varer/${id}`, data);
    return response.data;
  },

  // Slet vare
  delete: async (id) => {
    const response = await apiClient.delete(`/varer/${id}`);
    return response.data;
  },
};