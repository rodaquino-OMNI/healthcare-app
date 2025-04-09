import apiClient from './api/apiClient';

// Medication status types
export type MedicationStatus = 'active' | 'discontinued' | 'completed' | 'on-hold' | 'entered-in-error';

// Medication interface
export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: MedicationStatus;
  prescribedBy: string;
  instructions?: string;
  reason?: string;
}

// Pagination response interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter interface for medications
export interface MedicationFilter {
  patientId?: string;
  status?: MedicationStatus | MedicationStatus[];
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Medication;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Service for handling medication-related API calls
 */
export class MedicationService {
  /**
   * Get all medications with filtering and pagination
   */
  static async getAll(filters: MedicationFilter = {}): Promise<PaginatedResponse<Medication>> {
    try {
      const response = await apiClient.get('/medications', { 
        params: {
          ...filters,
          // Handle array of statuses for the API
          status: Array.isArray(filters.status) ? filters.status.join(',') : filters.status
        }
      });
      return response.data;
    } catch (error) {
      // Add retry logic for transient errors
      if (error.response?.status === 503 || error.response?.status === 504) {
        // Wait a second and retry once
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retryResponse = await apiClient.get('/medications', { 
          params: {
            ...filters,
            status: Array.isArray(filters.status) ? filters.status.join(',') : filters.status
          }
        });
        return retryResponse.data;
      }
      throw error;
    }
  }

  /**
   * Get a single medication by ID
   */
  static async getById(id: string): Promise<Medication> {
    const response = await apiClient.get(`/medications/${id}`);
    return response.data;
  }

  /**
   * Get all medications for a specific patient
   */
  static async getByPatientId(patientId: string, filters: Omit<MedicationFilter, 'patientId'> = {}): Promise<PaginatedResponse<Medication>> {
    const response = await apiClient.get(`/patients/${patientId}/medications`, { 
      params: {
        ...filters,
        status: Array.isArray(filters.status) ? filters.status.join(',') : filters.status
      } 
    });
    return response.data;
  }

  /**
   * Create a new medication
   */
  static async create(medication: Omit<Medication, 'id'>): Promise<Medication> {
    const response = await apiClient.post('/medications', medication);
    return response.data;
  }

  /**
   * Update a medication
   */
  static async update(id: string, medicationData: Partial<Medication>): Promise<Medication> {
    const response = await apiClient.put(`/medications/${id}`, medicationData);
    return response.data;
  }

  /**
   * Update just the status of a medication
   */
  static async updateStatus(id: string, status: MedicationStatus): Promise<Medication> {
    const response = await apiClient.patch(`/medications/${id}/status`, { status });
    return response.data;
  }

  /**
   * Delete a medication
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/medications/${id}`);
  }
  
  /**
   * Search for medications by name
   */
  static async search(query: string, limit: number = 10): Promise<Medication[]> {
    const response = await apiClient.get('/medications/search', { 
      params: { query, limit } 
    });
    return response.data;
  }
  
  /**
   * Get all available medication statuses
   */
  static async getStatuses(): Promise<MedicationStatus[]> {
    const response = await apiClient.get('/medications/statuses');
    return response.data;
  }
}