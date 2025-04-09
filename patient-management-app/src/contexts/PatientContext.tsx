import React from 'react';
import { apiClient } from '../services/api/apiClient';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  medicalHistory?: string;
  allergies?: string[];
}

interface PatientContextType {
  patients: Patient[];
  currentPatient: Patient | null;
  isLoading: boolean;
  error: Error | null;
  loadPatients: () => Promise<void>;
  loadPatient: (id: string) => Promise<void>;
  createPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

const PatientContext = React.createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = React.useState<Patient | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  const loadPatients = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load patients'));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadPatient = React.useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/patients/${id}`);
      setCurrentPatient(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to load patient ${id}`));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const createPatient = React.useCallback(async (patient: Omit<Patient, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/patients', patient);
      setPatients(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create patient'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updatePatient = React.useCallback(async (id: string, patientData: Partial<Patient>) => {
    setIsLoading(true);
    setError(null);
    
    // Optimistic update
    const previousPatient = patients.find(p => p.id === id);
    if (previousPatient) {
      const updatedPatient = { ...previousPatient, ...patientData };
      
      // Update patients list
      setPatients(prev => 
        prev.map(p => p.id === id ? updatedPatient : p)
      );
      
      // Update current patient if it's the same one
      if (currentPatient?.id === id) {
        setCurrentPatient(updatedPatient);
      }
    }
    
    try {
      const response = await apiClient.put(`/patients/${id}`, patientData);
      
      // Update with server response data
      const serverPatient = response.data;
      
      // Update patients list
      setPatients(prev => 
        prev.map(p => p.id === id ? serverPatient : p)
      );
      
      // Update current patient if it's the same one
      if (currentPatient?.id === id) {
        setCurrentPatient(serverPatient);
      }
      
    } catch (err) {
      // Rollback on error
      setPatients(prev => 
        previousPatient ? 
        prev.map(p => p.id === id ? previousPatient : p) : 
        prev
      );
      
      if (currentPatient?.id === id && previousPatient) {
        setCurrentPatient(previousPatient);
      }
      
      setError(err instanceof Error ? err : new Error(`Failed to update patient ${id}`));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [patients, currentPatient]);
  
  const deletePatient = React.useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    // Store patient for rollback
    const previousPatient = patients.find(p => p.id === id);
    
    // Optimistic delete
    setPatients(prev => prev.filter(p => p.id !== id));
    
    // Clear current patient if it's the same one
    if (currentPatient?.id === id) {
      setCurrentPatient(null);
    }
    
    try {
      await apiClient.delete(`/patients/${id}`);
    } catch (err) {
      // Rollback on error
      if (previousPatient) {
        setPatients(prev => [...prev, previousPatient]);
        
        // Restore current patient if it was deleted
        if (currentPatient?.id === id) {
          setCurrentPatient(previousPatient);
        }
      }
      
      setError(err instanceof Error ? err : new Error(`Failed to delete patient ${id}`));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [patients, currentPatient]);
  
  return (
    <PatientContext.Provider
      value={{
        patients,
        currentPatient,
        isLoading,
        error,
        loadPatients,
        loadPatient,
        createPatient,
        updatePatient,
        deletePatient
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = React.useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

export type { Patient };
