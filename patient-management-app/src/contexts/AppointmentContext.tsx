import * as React from 'react';
import { AppointmentService, Appointment } from '../services/AppointmentService';
import { announceToScreenReader } from '../utils/accessibility';

interface AppointmentContextType {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  isLoading: boolean;
  error: Error | null;
  loadAppointments: (patientId?: string) => Promise<void>;
  setCurrentAppointment: (appointment: Appointment | null) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  scheduleAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
}

const AppointmentContext = React.createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [currentAppointment, setCurrentAppointment] = React.useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadAppointments = React.useCallback(async (patientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AppointmentService.getAll(patientId);
      setAppointments(data);
      announceToScreenReader(`Loaded ${data.length} appointments`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load appointments');
      setError(error);
      announceToScreenReader(`Error loading appointments: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAppointmentStatus = React.useCallback(async (id: string, status: Appointment['status']) => {
    setError(null);
    
    // Find the appointment to update
    const appointmentToUpdate = appointments.find(app => app.id === id);
    if (!appointmentToUpdate) {
      const error = new Error(`Appointment with id ${id} not found`);
      setError(error);
      return;
    }

    // Store the original status for rollback if needed
    const originalStatus = appointmentToUpdate.status;
    
    // Optimistic update
    setAppointments(prevAppointments => 
      prevAppointments.map(app => 
        app.id === id ? { ...app, status } : app
      )
    );

    if (currentAppointment?.id === id) {
      setCurrentAppointment(prev => prev ? { ...prev, status } : null);
    }
    
    announceToScreenReader(`Appointment status updated to ${status}`);

    try {
      // Persist the change to the server
      const updatedAppointment = await AppointmentService.updateStatus(id, status);
      
      // Update with server response
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app.id === id ? updatedAppointment : app
        )
      );

      if (currentAppointment?.id === id) {
        setCurrentAppointment(updatedAppointment);
      }
    } catch (err) {
      // Rollback on error
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app.id === id ? { ...app, status: originalStatus } : app
        )
      );

      if (currentAppointment?.id === id) {
        setCurrentAppointment(prev => prev ? { ...prev, status: originalStatus } : null);
      }
      
      const error = err instanceof Error ? err : new Error('Failed to update appointment status');
      setError(error);
      announceToScreenReader(`Error updating appointment: ${error.message}`);
    }
  }, [appointments, currentAppointment]);

  const scheduleAppointment = React.useCallback(async (appointment: Omit<Appointment, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointment = await AppointmentService.create(appointment);
      setAppointments(prev => [...prev, newAppointment]);
      announceToScreenReader('New appointment scheduled successfully');
      return;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to schedule appointment');
      setError(error);
      announceToScreenReader(`Error scheduling appointment: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        currentAppointment,
        isLoading,
        error,
        loadAppointments,
        setCurrentAppointment,
        updateAppointmentStatus,
        scheduleAppointment
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = React.useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};