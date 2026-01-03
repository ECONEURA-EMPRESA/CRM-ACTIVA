import { apiRequest } from './client';
import { Patient, ClinicSettings } from '../lib/types';

export const PatientsService = {
  getAll: () => apiRequest<Patient[]>('/api/patients'),

  getById: (id: string) => apiRequest<Patient>(`/api/patients/${id}`),

  create: (data: Omit<Patient, 'id'>) =>
    apiRequest<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Patient>) =>
    apiRequest<Patient>(`/api/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/patients/${id}`, {
      method: 'DELETE',
    }),
};

export const SettingsService = {
  get: () => apiRequest<ClinicSettings>('/api/settings'),

  save: (data: ClinicSettings) =>
    apiRequest<{ success: boolean }>('/api/settings', {
      method: 'POST', // Using POST for upsert as defined in server.ts
      body: JSON.stringify(data),
    }),
};
