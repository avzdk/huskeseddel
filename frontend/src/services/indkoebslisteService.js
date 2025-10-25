/**
 * Indkøbsliste API service
 */
import apiClient from './api.js';

export const indkoebslisteService = {
  // Hent aktiv indkøbsliste
  getAktivListe: async () => {
    const response = await apiClient.get('/indkoebsliste');
    return response.data;
  },

  // Hent historik over købte varer
  getHistorik: async (limit = 50) => {
    const response = await apiClient.get(`/indkoebsliste/historik?limit=${limit}`);
    return response.data;
  },

  // Tilføj vare til indkøbsliste
  tilfoejVare: async (vareId, noteListe = '') => {
    const response = await apiClient.post('/indkoebsliste/tilfoej', {
      vare_id: vareId,
      note_liste: noteListe,
    });
    return response.data;
  },

  // Opdater liste element
  updateElement: async (elementId, data) => {
    const response = await apiClient.put(`/indkoebsliste/${elementId}`, data);
    return response.data;
  },

  // Marker som købt
  markerSomKoebt: async (elementId) => {
    const response = await apiClient.post(`/indkoebsliste/${elementId}/koeb`);
    return response.data;
  },

  // Genaktiver købt vare
  genaktiver: async (elementId) => {
    const response = await apiClient.post(`/indkoebsliste/${elementId}/genaktiver`);
    return response.data;
  },

  // Fjern fra liste
  fjernFraListe: async (elementId) => {
    const response = await apiClient.delete(`/indkoebsliste/${elementId}`);
    return response.data;
  },

  // Ryd alle købte varer
  rydKoebtevarer: async () => {
    const response = await apiClient.delete('/indkoebsliste/ryd-købte');
    return response.data;
  },

  // Hent liste statistik
  getStats: async () => {
    const response = await apiClient.get('/indkoebsliste/stats');
    return response.data;
  },
};