import React from 'react';
import { 
  MedicationService, 
  Medication, 
  MedicationFilter, 
  PaginatedResponse 
} from '../services/MedicationService';
import { announceToScreenReader } from '../utils/accessibility';

interface MedicationContextType {
  medications: Medication[];
  currentMedication: Medication | null;
  isLoading: boolean;
  error: Error | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: MedicationFilter;
  loadMedications: (newFilters?: MedicationFilter) => Promise<void>;
  setCurrentMedication: (medication: Medication | null) => void;
  updateMedicationStatus: (id: string, status: Medication['status']) => Promise<void>;
  prescribeMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchTerm: (search: string) => void;
  setStatusFilter: (status: Medication['status'] | Medication['status'][] | undefined) => void;
  setDateRangeFilter: (fromDate?: string, toDate?: string) => void;
  setSorting: (sortBy: keyof Medication, sortDirection: 'asc' | 'desc') => void;
}

const defaultPagination = {
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0
};

const defaultFilters: MedicationFilter = {
  page: 1,
  pageSize: 10,
  sortBy: 'name',
  sortDirection: 'asc'
};

const MedicationContext = React.createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode; patientId?: string }> = ({ 
  children, 
  patientId 
}) => {
  const [medications, setMedications] = React.useState<Medication[]>([]);
  const [currentMedication, setCurrentMedication] = React.useState<Medication | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [pagination, setPagination] = React.useState(defaultPagination);
  const [filters, setFilters] = React.useState<MedicationFilter>({
    ...defaultFilters,
    patientId
  });

  const loadMedications = React.useCallback(async (newFilters?: MedicationFilter) => {
    setIsLoading(true);
    setError(null);
    
    const currentFilters = newFilters ? { ...filters, ...newFilters } : filters;
    setFilters(currentFilters);
    
    try {
      const response: PaginatedResponse<Medication> = await MedicationService.getAll(currentFilters);
      setMedications(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      });
      
      announceToScreenReader(
        `Loaded ${response.data.length} medications, page ${response.page} of ${response.totalPages}`
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load medications');
      setError(error);
      announceToScreenReader(`Error loading medications: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateMedicationStatus = React.useCallback(async (id: string, status: Medication['status']) => {
    setError(null);
    
    // Find the medication to update
    const medicationToUpdate = medications.find(med => med.id === id);
    if (!medicationToUpdate) {
      const error = new Error(`Medication with id ${id} not found`);
      setError(error);
      return;
    }

    // Store the original status for rollback if needed
    const originalStatus = medicationToUpdate.status;
    
    // Optimistic update
    setMedications(prevMedications => 
      prevMedications.map(med => 
        med.id === id ? { ...med, status } : med
      )
    );

    if (currentMedication?.id === id) {
      setCurrentMedication(prev => prev ? { ...prev, status } : null);
    }
    
    announceToScreenReader(`Medication status updated to ${status}`);

    try {
      // Persist the change to the server
      const updatedMedication = await MedicationService.updateStatus(id, status);
      
      // Update with server response
      setMedications(prevMedications =>
        prevMedications.map(med =>
          med.id === id ? updatedMedication : med
        )
      );

      if (currentMedication?.id === id) {
        setCurrentMedication(updatedMedication);
      }
    } catch (err) {
      // Rollback on error
      setMedications(prevMedications =>
        prevMedications.map(med =>
          med.id === id ? { ...med, status: originalStatus } : med
        )
      );

      if (currentMedication?.id === id) {
        setCurrentMedication(prev => prev ? { ...prev, status: originalStatus } : null);
      }
      
      const error = err instanceof Error ? err : new Error('Failed to update medication status');
      setError(error);
      announceToScreenReader(`Error updating medication: ${error.message}`);
    }
  }, [medications, currentMedication]);

  const prescribeMedication = React.useCallback(async (medication: Omit<Medication, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newMedication = await MedicationService.create(medication);
      
      // Only add to current list if it matches our filters
      if (filters.patientId === medication.patientId) {
        setMedications(prev => [...prev, newMedication]);
        setPagination(prev => ({
          ...prev,
          total: prev.total + 1,
          totalPages: Math.ceil((prev.total + 1) / prev.pageSize)
        }));
      }
      
      announceToScreenReader('New medication prescribed successfully');
      return;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to prescribe medication');
      setError(error);
      announceToScreenReader(`Error prescribing medication: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Pagination and filtering helpers
  const setPage = React.useCallback((page: number) => {
    loadMedications({ ...filters, page });
  }, [filters, loadMedications]);

  const setPageSize = React.useCallback((pageSize: number) => {
    const newPage = Math.floor(((pagination.page - 1) * pagination.pageSize) / pageSize) + 1;
    loadMedications({ ...filters, pageSize, page: newPage });
  }, [filters, loadMedications, pagination]);

  const setSearchTerm = React.useCallback((search: string) => {
    loadMedications({ ...filters, search, page: 1 });
  }, [filters, loadMedications]);

  const setStatusFilter = React.useCallback((status: Medication['status'] | Medication['status'][] | undefined) => {
    loadMedications({ ...filters, status, page: 1 });
  }, [filters, loadMedications]);

  const setDateRangeFilter = React.useCallback((fromDate?: string, toDate?: string) => {
    loadMedications({ ...filters, fromDate, toDate, page: 1 });
  }, [filters, loadMedications]);

  const setSorting = React.useCallback((sortBy: keyof Medication, sortDirection: 'asc' | 'desc') => {
    loadMedications({ ...filters, sortBy, sortDirection, page: 1 });
  }, [filters, loadMedications]);

  // Load medications on first render or when patientId changes
  React.useEffect(() => {
    if (patientId !== filters.patientId) {
      const updatedFilters = { ...filters, patientId, page: 1 };
      setFilters(updatedFilters);
      loadMedications(updatedFilters);
    } else {
      loadMedications();
    }
  }, [patientId]);

  return (
    <MedicationContext.Provider
      value={{
        medications,
        currentMedication,
        isLoading,
        error,
        pagination,
        filters,
        loadMedications,
        setCurrentMedication,
        updateMedicationStatus,
        prescribeMedication,
        setPage,
        setPageSize,
        setSearchTerm,
        setStatusFilter,
        setDateRangeFilter,
        setSorting
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = React.useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};
