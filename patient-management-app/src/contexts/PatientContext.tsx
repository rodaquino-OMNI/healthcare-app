import React from 'react';
import { useParams } from 'react-router-dom';
import { patientService } from '../services/api/patientService';

// Access React APIs via namespace
const { createContext, useContext, useState, useEffect } = React;

// We'll use the FHIR Patient type from ltht-react/types when available
// For now, define a basic interface
interface Patient {
  id: string;
  identifier?: Array<{
    system: string;
    value: string;
  }>;
  name?: Array<{
    family?: string;
    given?: string[];
    use?: string;
  }>;
  gender?: string;
  birthDate?: string;
  address?: Array<{
    line?: string[];
    city?: string;
    postalCode?: string;
  }>;
  telecom?: Array<{
    system?: string;
    value?: string;
    use?: string;
  }>;
  flags?: any[];
  allergies?: any[];
}

interface PatientContextType {
  patient: Patient | null;
  isLoading: boolean;
  error: string | null;
  refreshPatient: () => Promise<void>;
}

// Create context with undefined default value
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Provider component
export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async () => {
    if (!patientId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const patientData = await patientService.getPatient(patientId);
      setPatient(patientData);
    } catch (err: any) {
      setError(err.message || 'Failed to load patient data');
      console.error('Error fetching patient:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const refreshPatient = async () => {
    await fetchPatient();
  };

  return (
    <PatientContext.Provider value={{ patient, isLoading, error, refreshPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

// Custom hook to use the patient context
export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

export default PatientContext;