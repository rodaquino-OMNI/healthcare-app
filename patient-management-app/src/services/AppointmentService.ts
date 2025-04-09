import apiClient from './api/apiClient';

// Appointment status types
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';

// Appointment interface
export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  dateTime: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  type: string;
  notes?: string;
  location?: string;
}

/**
 * Service for handling appointment-related API calls
 */
export class AppointmentService {
  /**
   * Get all appointments, optionally filtered by patient ID
   */
  static async getAll(patientId?: string): Promise<Appointment[]> {
    const params = patientId ? { patientId } : {};
    const response = await apiClient.get('/appointments', { params });
    return response.data;
  }

  /**
   * Get a single appointment by ID
   */
  static async getById(id: string): Promise<Appointment> {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  }

  /**
   * Get all appointments for a specific patient
   */
  static async getByPatientId(patientId: string): Promise<Appointment[]> {
    const response = await apiClient.get(`/patients/${patientId}/appointments`);
    return response.data;
  }

  /**
   * Create a new appointment
   */
  static async create(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const response = await apiClient.post('/appointments', appointment);
    return response.data;
  }

  /**
   * Update an appointment
   */
  static async update(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData);
    return response.data;
  }

  /**
   * Update just the status of an appointment
   */
  static async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }

  /**
   * Delete an appointment
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }

  /**
   * Get available time slots for a provider
   */
  static async getAvailableSlots(providerId: string, date: string): Promise<string[]> {
    const response = await apiClient.get('/appointments/available-slots', {
      params: { providerId, date }
    });
    return response.data;
  }

  /**
   * Check if a specific time slot is available
   */
  static async checkAvailability(providerId: string, dateTime: string, duration: number): Promise<boolean> {
    const response = await apiClient.get('/appointments/check-availability', {
      params: { providerId, dateTime, duration }
    });
    return response.data.available;
  }
}