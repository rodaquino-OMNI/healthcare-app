# Patient Management Application - Error Log

## Overview

This document logs all identified issues in the Patient Management Application, categorized by component and severity. Each issue includes detailed reproduction steps, impact analysis, and recommended fixes.

## Testing Methodology

Testing is conducted through systematic code review and component analysis, focusing on:

1. Authentication system
2. Patient management functionality
3. Appointment management
4. Medication management
5. UI/UX components
6. Performance considerations
7. Data validation and error handling

Issues are categorized by the following severity levels:

- **Critical**: Prevents core functionality, causes data loss, or presents security risks
- **High**: Severely impacts user workflow but has workarounds
- **Medium**: Affects secondary functionality or user experience
- **Low**: Minor cosmetic or non-functional issues

## Issue Tracking

Each issue follows this format:

```
## [ID] - [Component] - [Brief Description]

### Description
Detailed explanation of the issue.

### Environment
- Browser: [Browser and version]
- Screen size: [Device/resolution]
- User role: [If applicable]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
What should happen.

### Actual Behavior
What actually happens.

### Screenshots/Console Errors
Relevant error messages or visual evidence.

### Severity
[Critical/High/Medium/Low]

### Impact
How this affects users and business operations.

### Root Cause Analysis
Technical explanation of what's causing the issue.

### Recommended Fix
Proposed solution with code examples if applicable.

### Verification Method
How to verify the fix has resolved the issue.
```

## Issues Identified

_The following section will be populated as issues are discovered during testing._

## AUTH-01 - Authentication - Token Refresh Mechanism Not Integrated with API Requests

### Description
The application implements a token refresh mechanism in `authService.ts` but fails to properly integrate it with the API request flow. When a token expires, API requests will fail with 401 errors, but the application doesn't automatically refresh the token and retry the failed requests.

### Environment
- Browser: All browsers
- User role: All authenticated users

### Steps to Reproduce
1. Log in to the application
2. Wait for the JWT token to expire (set to 3600 seconds in `.env.testing`)
3. Attempt to access protected data (patients, appointments, etc.)

### Expected Behavior
The system should detect the expired token, automatically refresh it using the refresh token, and retry the original API request without user intervention.

### Actual Behavior
API requests fail with 401 Unauthorized errors after token expiration, forcing the user to log out and log in again to continue using the application.

### Console Errors
```
Error: Authentication failed
```

### Severity
High

### Impact
Users are unexpectedly logged out after the token expires (1 hour), disrupting their workflow and potentially causing data loss if they were in the middle of an operation.

### Root Cause Analysis
The `authService.refreshToken()` function exists but is never automatically called when API requests fail with 401 errors. There's no axios interceptor configured to handle token expiration and refresh.

### Recommended Fix
Implement an axios interceptor in a central location to handle 401 responses, refresh the token, and retry the original request:

```typescript
// Create a new file: src/services/api/apiClient.ts

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { authService } from '../auth/authService';

// Create an axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
});

// Add a request interceptor to attach the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if we're refreshing the token to prevent multiple refresh requests
let isRefreshing = false;
// Store queued requests to retry after token refresh
let failedQueue: any[] = [];

// Process the failed queue by either resolving or rejecting based on refresh success
const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing, queue this request to retry later
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const newToken = await authService.refreshToken();
        if (newToken) {
          // Successfully refreshed, retry original request
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } else {
          // Token refresh failed
          processQueue(new Error('Failed to refresh token'), null);
          authService.logout();
          return Promise.reject(new Error('Session expired. Please log in again.'));
        }
      } catch (refreshError) {
        // Handle refresh error
        processQueue(refreshError, null);
        authService.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

Then update all service files to use this apiClient instead of directly using axios:

```typescript
// Example modification for patientService.ts
import apiClient from './apiClient';

// Replace axios calls with apiClient
const response = await apiClient.get(`/patients/${patientId}`);
```

### Verification Method
1. Log in to the application
2. Using browser developer tools, manually expire the token by removing it or setting an expired date
3. Trigger an API request by navigating to a protected route
4. Confirm the request succeeds after automatic token refresh without user intervention

## PAT-01 - Patient Management - Inefficient Patient Data Refresh Mechanism

### Description
The PatientContext implementation forces a complete refetch of patient data with every context refresh, even when only a small part of the data has changed. Additionally, there's no proper error state recovery, meaning if a patient data fetch fails once, the user must manually reload the page to attempt recovery.

### Environment
- Browser: All browsers
- User role: All authenticated users

### Steps to Reproduce
1. Navigate to a patient detail page
2. Update a small piece of patient information
3. Call the `refreshPatient()` function
4. Observe network traffic in developer tools

### Expected Behavior
The system should implement optimistic updates for small changes and partial data fetching where appropriate, minimizing network requests and improving performance.

### Actual Behavior
Every refresh triggers a complete patient data refetch, and failed requests leave the application in an error state without automatic recovery attempts.

### Console Errors
```
Error fetching patient: Failed to load patient data
```

### Severity
Medium

### Impact
Excessive network requests lead to:
1. Slower perceived application performance
2. Increased server load
3. Potential data consistency issues
4. Poor user experience when errors occur

### Root Cause Analysis
1. The PatientContext uses a simplistic fetch pattern that always retrieves the entire patient object
2. Error handling is limited to displaying an error message without recovery attempts
3. There's no implementation of optimistic updates or data caching

### Recommended Fix
Implement a more sophisticated data management approach with the following improvements:

```typescript
// Update src/contexts/PatientContext.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { patientService } from '../services/api/patientService';

// Access React APIs via namespace
const { createContext, useContext, useState, useEffect, useCallback } = React;

// Same Patient interface as before...

interface PatientContextType {
  patient: Patient | null;
  isLoading: boolean;
  error: string | null;
  refreshPatient: (partialData?: Partial<Patient>) => Promise<void>;
  retryFetch: () => Promise<void>;
  updatePatientField: <K extends keyof Patient>(field: K, value: Patient[K]) => Promise<void>;
}

// Create context with undefined default value
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Provider component
export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3;

  // Enhanced fetch function with retry capability
  const fetchPatient = useCallback(async (silent: boolean = false) => {
    if (!patientId) return;
    
    if (!silent) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const patientData = await patientService.getPatient(patientId);
      setPatient(patientData);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error('Error fetching patient:', err);
      setError(err.message || 'Failed to load patient data');
      
      // Auto-retry up to maxRetries with exponential backoff
      if (retryCount < maxRetries) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchPatient(true);
        }, backoffTime);
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [patientId, retryCount]);

  // Initial fetch
  useEffect(() => {
    fetchPatient();
  }, [fetchPatient, patientId]);

  // Function to manually refresh patient data
  const refreshPatient = async (partialData?: Partial<Patient>) => {
    // If partial data is provided, update immediately (optimistic)
    if (partialData && patient) {
      setPatient({ ...patient, ...partialData });
    }
    
    // Then fetch complete data in the background
    await fetchPatient(true);
  };

  // Function to manually retry fetch after error
  const retryFetch = async () => {
    setRetryCount(0);
    await fetchPatient();
  };

  // Function to update a specific field with optimistic update
  const updatePatientField = async <K extends keyof Patient>(field: K, value: Patient[K]) => {
    if (!patient || !patientId) return;
    
    // Optimistic update
    const previousValue = patient[field];
    setPatient({ ...patient, [field]: value });
    
    try {
      // In a real app, this would call the API to update the field
      await patientService.updatePatientField(patientId, field, value);
      
      // Refresh in background to ensure consistency
      await fetchPatient(true);
    } catch (err: any) {
      // Rollback on failure
      setPatient({ ...patient, [field]: previousValue });
      setError(err.message || `Failed to update ${String(field)}`);
      console.error(`Error updating patient ${field}:`, err);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        isLoading,
        error,
        refreshPatient,
        retryFetch,
        updatePatientField
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

// Keep the usePatient hook as before...
```

Additionally, add the corresponding service method:

```typescript
// Update patientService.ts to add the updatePatientField method

// Add this method to the patientService object
updatePatientField: async <K extends keyof Patient>(
  patientId: string,
  field: K,
  value: Patient[K]
): Promise<void> => {
  try {
    // For development/prototype phase
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
    // Real API call with auth token
    const token = authService.getToken();
    await axios.patch(
      `${API_BASE_URL}/patients/${patientId}`,
      { [field]: value },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (error: any) {
    console.error(`Error updating patient field ${String(field)}:`, error);
    throw new Error(error.response?.data?.message || `Failed to update patient`);
  }
}
```

### Verification Method
1. Navigate to a patient detail page
2. Update a patient field using the new `updatePatientField` function
3. Verify that the UI updates immediately (optimistic update)
4. Check network traffic to confirm background data refresh
5. Deliberately cause an error and verify the automatic retry mechanism works

## APT-01 - Appointment Management - Status Changes Not Persisted

### Description
When a user changes the status of an appointment (e.g., marking as completed or cancelled), the change only updates the local component state but is not persisted to the backend. This creates a data inconsistency where the user believes they've updated an appointment's status, but the change is lost upon page refresh or navigation.

### Environment
- Browser: All browsers
- User role: All users with appointment management permissions

### Steps to Reproduce
1. Navigate to an appointment detail view (e.g., `/appointments/appt-001`)
2. Click "Mark as Completed" or "Cancel Appointment" button
3. Observe the status badge update
4. Refresh the page

### Expected Behavior
The appointment status change should be persisted to the backend and remain consistent after page refresh or navigation.

### Actual Behavior
The appointment status reverts to its original value after page refresh, as the change was only made to local state and not sent to the backend.

### Console Errors
No console errors, but data inconsistency occurs.

### Severity
High

### Impact
This issue causes:
1. Data inconsistency between frontend and backend
2. User confusion and frustration when appointment status changes disappear
3. Potential workflow disruptions in clinical settings
4. Possible duplicate work as users may attempt to update the same appointment multiple times

### Root Cause Analysis
In the `AppointmentDetail.tsx` component, the status change handlers (`handleCompleteAppointment` and `handleCancelAppointment`) only update the local component state without making API calls to persist these changes:

```typescript
const handleCompleteAppointment = () => {
  // In a real application, this would call an API to update the appointment status
  if (appointment) {
    setAppointment({
      ...appointment,
      status: 'completed'
    });
  }
};
```

The comment acknowledges that in a real application, an API call would be made, but the implementation is missing.

### Recommended Fix
Implement an appointment service with methods to update appointment status and integrate it with the AppointmentDetail component:

```typescript
// Create src/services/api/appointmentService.ts

import axios from 'axios';
import { authService } from '../auth/authService';

// API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

// Appointment type definition
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerName: string;
  appointmentType: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
}

/**
 * Service for Appointment resource operations
 */
export const appointmentService = {
  /**
   * Get all appointments (with optional filters)
   */
  getAppointments: async (filters?: Record<string, string>): Promise<Appointment[]> => {
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Simulate network delay and return mock data
        // ... (mock implementation)
      }
      
      // Real API call with auth token
      const token = authService.getToken();
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: filters
      });
      
      return response.data.appointments;
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },
  
  /**
   * Get a single appointment by ID
   */
  getAppointment: async (appointmentId: string): Promise<Appointment> => {
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // ... (mock implementation)
      }
      
      // Real API call with auth token
      const token = authService.getToken();
      const response = await axios.get(`${API_BASE_URL}/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.appointment;
    } catch (error: any) {
      console.error(`Error fetching appointment ${appointmentId}:`, error);
      throw new Error(error.response?.data?.message || `Failed to fetch appointment ${appointmentId}`);
    }
  },
  
  /**
   * Update appointment status
   */
  updateAppointmentStatus: async (
    appointmentId: string,
    status: 'scheduled' | 'completed' | 'cancelled'
  ): Promise<Appointment> => {
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock updated appointment
        return {
          id: appointmentId,
          patientId: 'patient-001',
          patientName: 'John Smith',
          providerName: 'Dr. Emily Johnson',
          appointmentType: 'Check-up',
          date: '2025-07-15',
          time: '09:00',
          duration: 30,
          status: status,
          location: 'Main Clinic - Room 204',
          notes: 'Patient requested a medication review during this appointment.'
        };
      }
      
      // Real API call with auth token
      const token = authService.getToken();
      const response = await axios.patch(
        `${API_BASE_URL}/appointments/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data.appointment;
    } catch (error: any) {
      console.error(`Error updating appointment status for ${appointmentId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update appointment status');
    }
  }
};

export default appointmentService;
```

Then update the AppointmentDetail component to use this service:

```typescript
// Update in src/pages/appointment/AppointmentDetail.tsx

import { appointmentService } from '../../services/api/appointmentService';

// ... existing code ...

const handleCompleteAppointment = async () => {
  try {
    setIsLoading(true);
    const updatedAppointment = await appointmentService.updateAppointmentStatus(
      appointmentId || '',
      'completed'
    );
    setAppointment(updatedAppointment);
  } catch (err: any) {
    setError(err.message || 'Failed to update appointment status');
    console.error('Error completing appointment:', err);
  } finally {
    setIsLoading(false);
  }
};

const handleCancelAppointment = async () => {
  try {
    setIsLoading(true);
    const updatedAppointment = await appointmentService.updateAppointmentStatus(
      appointmentId || '',
      'cancelled'
    );
    setAppointment(updatedAppointment);
  } catch (err: any) {
    setError(err.message || 'Failed to update appointment status');
    console.error('Error cancelling appointment:', err);
  } finally {
    setIsLoading(false);
  }
};
```

### Verification Method
1. Navigate to an appointment detail view
2. Click "Mark as Completed" button
3. Verify loading state appears during API call
4. Confirm status changes to "Completed"
5. Refresh the page and verify the status remains "Completed"
6. Repeat the test with the "Cancel Appointment" button

## MED-01 - Medication Management - Limited Filtering and Error Handling

### Description
The MedicationList component provides only basic status filtering and lacks important functionality for effectively managing larger medication lists. It doesn't handle empty result sets gracefully, lacks search functionality, and doesn't provide patient-specific filtering. Additionally, error states don't offer sufficient recovery options.

### Environment
- Browser: All browsers
- User role: All authenticated users

### Steps to Reproduce
1. Navigate to the medications page
2. Attempt to filter by status when no medications match the selected status
3. Try to find a specific medication when the list is large

### Expected Behavior
The system should provide robust filtering, sorting, and searching capabilities for managing medications. Empty result sets should display user-friendly messages with clear actions, and error states should include recovery options.

### Actual Behavior
1. Only basic status filtering is available
2. No search functionality exists
3. No patient-specific filtering
4. Empty result sets show a generic message with no helpful actions
5. Errors require page refresh to recover

### Console Errors
No specific console errors, but limited user experience.

### Severity
Medium

### Impact
1. Reduced usability when working with large medication lists
2. Increased time to find specific medications
3. Difficulty in managing patient-specific medication views
4. Poor user experience when encountering errors or empty result sets

### Root Cause Analysis
The MedicationList component has several limitations:

1. Single filter implementation (status only)
2. No search functionality
3. No patient-specific filtering
4. Basic error handling without recovery options
5. No pagination for large data sets

### Recommended Fix
Enhance the MedicationList component with improved filtering, searching, and error handling:

```typescript
// Update src/pages/medication/MedicationList.tsx

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Card, List, Button, Input } from '../../utils/ltht-component-wrappers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

// Access React APIs via namespace
const { useState, useEffect, useCallback } = React;

// Styled components remain the same...

// Add enhanced Search and Filter container
const SearchAndFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled(Input)`
  min-width: 250px;
  flex-grow: 1;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 2rem;
  
  h3 {
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: #6c757d;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  button {
    min-width: 2.5rem;
  }
`;

interface Medication {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'stopped';
  dosage: string;
  frequency: string;
  prescribedDate: string;
  patientId: string;
  patientName: string;
}

/**
 * Enhanced Medication list page component
 */
const MedicationList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [patientFilter, setPatientFilter] = useState<string>(searchParams.get('patient') || 'all');
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));
  const itemsPerPage = 10;
  
  const navigate = useNavigate();
  
  // Fetch medications
  const fetchMedications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock medication data (same as before)
      const mockMedications: Medication[] = [/* mock data... */];
      
      setMedications(mockMedications);
    } catch (err: any) {
      setError(err.message || 'Failed to load medications');
      console.error('Error fetching medications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);
  
  // Apply filters and search
  useEffect(() => {
    // Apply filters to medications
    let filtered = [...medications];
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(med => med.status === statusFilter);
    }
    
    // Patient filter
    if (patientFilter !== 'all') {
      filtered = filtered.filter(med => med.patientId === patientFilter);
    }
    
    // Search term
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(med =>
        med.name.toLowerCase().includes(search) ||
        med.dosage.toLowerCase().includes(search) ||
        med.patientName.toLowerCase().includes(search)
      );
    }
    
    setFilteredMedications(filtered);
    
    // Update URL params for bookmarking/sharing
    const params: Record<string, string> = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (patientFilter !== 'all') params.patient = patientFilter;
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params, { replace: true });
  }, [medications, statusFilter, patientFilter, searchTerm, currentPage, setSearchParams]);
  
  // Get unique patient IDs for filter dropdown
  const uniquePatients = [...new Set(medications.map(med => med.patientId))];
  
  // Pagination
  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);
  const paginatedMedications = filteredMedications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle medication click
  const handleMedicationClick = (medicationId: string) => {
    navigate(`/medications/${medicationId}`);
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle filter changes
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handlePatientFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPatientFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter('all');
    setPatientFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  // Handle retry on error
  const handleRetry = () => {
    fetchMedications();
  };
  
  if (isLoading) return <LoadingSpinner />;
  
  if (error) return (
    <ErrorMessage
      message={error}
      onRetry={handleRetry}
      actionText="Retry loading medications"
    />
  );
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Medications</PageTitle>
        <Button
          variant="primary"
          onClick={() => navigate('/medications/new')}
        >
          New Prescription
        </Button>
      </PageHeader>
      
      <Card>
        <Card.Body>
          <SearchAndFilterContainer>
            <SearchInput
              type="text"
              placeholder="Search medications by name, dosage, or patient..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
            <FilterGroup>
              <FilterSelect
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="stopped">Stopped</option>
              </FilterSelect>
              
              <FilterSelect
                value={patientFilter}
                onChange={handlePatientFilterChange}
              >
                <option value="all">All Patients</option>
                {uniquePatients.map(patientId => {
                  const patient = medications.find(med => med.patientId === patientId);
                  return (
                    <option key={patientId} value={patientId}>
                      {patient?.patientName || 'Unknown Patient'}
                    </option>
                  );
                })}
              </FilterSelect>
              
              {(statusFilter !== 'all' || patientFilter !== 'all' || searchTerm) && (
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </FilterGroup>
          </SearchAndFilterContainer>
          
          {paginatedMedications.length > 0 ? (
            <>
              <List>
                {paginatedMedications.map(medication => (
                  <List.Item key={medication.id}>
                    <MedicationItem onClick={() => handleMedicationClick(medication.id)}>
                      <MedicationInfo>
                        <MedicationName>{medication.name}</MedicationName>
                        <MedicationDetails>
                          <div>Dosage: {medication.dosage}, {medication.frequency}</div>
                          <div>Prescribed: {medication.prescribedDate}</div>
                          <div>Patient: {medication.patientName}</div>
                        </MedicationDetails>
                      </MedicationInfo>
                      <StatusBadge status={medication.status}>
                        {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                      </StatusBadge>
                    </MedicationItem>
                  </List.Item>
                ))}
              </List>
              
              {totalPages > 1 && (
                <Pagination>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'outline-secondary'}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </Button>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyStateContainer>
              <h3>No medications found</h3>
              <p>
                {searchTerm || statusFilter !== 'all' || patientFilter !== 'all'
                  ? 'Try adjusting your filters or search term to see more results.'
                  : 'There are no medications in the system yet.'}
              </p>
              
              {(searchTerm || statusFilter !== 'all' || patientFilter !== 'all') && (
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              )}
              
              {!searchTerm && statusFilter === 'all' && patientFilter === 'all' && (
                <Button
                  variant="primary"
                  onClick={() => navigate('/medications/new')}
                >
                  Create New Prescription
                </Button>
              )}
            </EmptyStateContainer>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default MedicationList;
```

### Verification Method
1. Navigate to the medications page
2. Test the search functionality by entering medication names, dosages, or patient names
3. Verify that filtering by status works correctly
4. Verify that filtering by patient works correctly
5. Test pagination by adding more mock records
6. Confirm that error states provide clear recovery options
7. Verify that empty search results display a helpful message with actions

## UI-01 - UI/UX - Accessibility and Responsive Design Issues

### Description
The application has multiple accessibility issues that would hinder users with disabilities from effectively using the system. Additionally, the responsive design implementation is inconsistent across components, leading to poor mobile and tablet experiences.

### Environment
- Browser: All browsers
- Screen sizes: Desktop, tablet, and mobile
- User role: All users, particularly those using assistive technologies

### Steps to Reproduce
1. Use a screen reader to navigate the application
2. Test keyboard-only navigation throughout the app
3. Access the application on mobile and tablet viewports
4. Use browser developer tools to test color contrast

### Expected Behavior
The application should be fully accessible to users with disabilities, following WCAG 2.1 AA standards. It should also provide a consistent user experience across all device sizes.

### Actual Behavior
1. Many interactive elements lack proper ARIA attributes
2. Keyboard focus indicators are not visible on many interactive elements
3. Some color combinations have insufficient contrast
4. Form elements lack proper labels and error states
5. Mobile views have overflow issues and touch targets that are too small

### Console Errors
No specific console errors, but accessibility audit tools would report numerous issues.

### Severity
High

### Impact
1. Users with disabilities may be unable to use the application
2. Potential legal compliance issues (ADA, Section 508, or similar regulations)
3. Poor user experience on mobile devices
4. Reduced user base and potential discrimination against users with disabilities

### Root Cause Analysis
The application has several accessibility and responsive design deficiencies:

1. Missing or inadequate ARIA attributes
2. No focus management strategy
3. Inconsistent use of media queries
4. Hardcoded pixel values instead of relative units
5. Manual color implementations without checking contrast

### Recommended Fix
Implement a comprehensive accessibility and responsive design overhaul:

1. Create a set of accessibility utilities:

```typescript
// Create src/utils/accessibilityUtils.ts

/**
 * Utility to generate unique IDs for ARIA attributes
 */
export const generateId = (() => {
  let count = 0;
  return (prefix: string) => `${prefix}-${count++}`;
})();

/**
 * Utility to announce messages to screen readers
 */
export const announceToScreenReader = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div');
  announcer.className = 'sr-only';
  announcer.setAttribute('aria-live', politeness);
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 3000);
};

/**
 * Keyboard event handler to support focus trapping in modals
 */
export const trapFocus = (e: KeyboardEvent, containerRef: React.RefObject<HTMLElement>, onEscape?: () => void) => {
  if (!containerRef.current) return;
  
  const focusableElements = containerRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Handle Escape key
  if (e.key === 'Escape' && onEscape) {
    onEscape();
    return;
  }
  
  // Handle tab key to trap focus
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};

/**
 * Focus first focusable element in container
 */
export const focusFirstElement = (containerRef: React.RefObject<HTMLElement>) => {
  if (!containerRef.current) return;
  
  const focusableElements = containerRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};
```

2. Add a global CSS file with accessibility and responsive design fixes:

```css
/* Create src/styles/accessibilityStyles.css */

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Visible focus styles */
:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0d6efd;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

/* Base responsive design settings */
html {
  font-size: 16px;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}

/* Responsive breakpoints using rem units */
@media (max-width: 48rem) { /* 768px */
  html {
    font-size: 14px;
  }
  
  .responsive-container {
    padding: 0 1rem;
  }
}

@media (max-width: 36rem) { /* 576px */
  html {
    font-size: 12px;
  }
  
  .responsive-container {
    padding: 0 0.75rem;
  }
}

/* Improve touch targets on mobile */
@media (max-width: 36rem) {
  button,
  [role="button"],
  input,
  select,
  a {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Improved form accessibility */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.5rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Make focus visible in high contrast mode */
@media (forced-colors: active) {
  :focus {
    outline: 2px solid CanvasText;
  }
}
```

3. Update App.tsx to include accessibility features:

```typescript
// Update src/App.tsx

import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/accessibilityStyles.css';

// Import other components...

const App: React.FC = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  return (
    <BrowserRouter>
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className="app-container">
        <Header />
        <main id="main-content" ref={mainContentRef} tabIndex={-1}>
          <Routes>
            {/* Routes here... */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
```

4. Create an accessibility hook for form handling:

```typescript
// Create src/hooks/useAccessibleForm.ts

import { useState, useId } from 'react';

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
  required?: boolean;
}

interface FormFields {
  [key: string]: FormField;
}

interface UseAccessibleFormOptions {
  onSubmit: (values: Record<string, string>) => void;
  initialValues: Record<string, string>;
  validate?: (values: Record<string, string>) => Record<string, string | null>;
}

export const useAccessibleForm = (options: UseAccessibleFormOptions) => {
  const { onSubmit, initialValues, validate } = options;
  const formId = useId();
  
  // Convert initial values to form fields
  const initialFields: FormFields = Object.entries(initialValues).reduce((fields, [key, value]) => ({
    ...fields,
    [key]: {
      value,
      error: null,
      touched: false,
      required: false
    }
  }), {});
  
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Generate IDs for form elements
  const getFieldId = (fieldName: string) => `${formId}-${fieldName}`;
  
  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true
      }
    }));
    
    // Clear form error when user types
    if (formError) {
      setFormError(null);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    if (!validate) return true;
    
    const values = Object.entries(fields).reduce((vals, [key, field]) => ({
      ...vals,
      [key]: field.value
    }), {});
    
    const errors = validate(values);
    const hasErrors = Object.values(errors).some(error => error !== null);
    
    setFields(prev =>
      Object.entries(prev).reduce((updated, [key, field]) => ({
        ...updated,
        [key]: {
          ...field,
          error: errors[key] || null,
          touched: true
        }
      }), {})
    );
    
    return !hasErrors;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    const isValid = validateForm();
    
    if (isValid) {
      const values = Object.entries(fields).reduce((vals, [key, field]) => ({
        ...vals,
        [key]: field.value
      }), {});
      
      try {
        onSubmit(values);
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'Form submission failed');
      }
    } else {
      // Announce errors to screen readers
      const errorCount = Object.values(fields).filter(field => field.error).length;
      const message = `Form has ${errorCount} ${errorCount === 1 ? 'error' : 'errors'}. Please correct before submitting.`;
      
      // Announce error message
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.className = 'sr-only';
      announcer.innerText = message;
      document.body.appendChild(announcer);
      
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 3000);
    }
  };
  
  // Mark a field as required
  const setRequired = (fieldName: string, isRequired: boolean = true) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        required: isRequired
      }
    }));
  };
  
  return {
    fields,
    formSubmitted,
    formError,
    handleChange,
    handleSubmit,
    validateForm,
    getFieldId,
    setRequired,
    setFormError
  };
};
```

5. Example implementation in a component:

```typescript
// Update an example form component with accessibility improvements

import React, { useRef } from 'react';
import { useAccessibleForm } from '../../hooks/useAccessibleForm';
import { trapFocus, focusFirstElement } from '../../utils/accessibilityUtils';

const LoginForm: React.FC = () => {
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string | null> = {
      email: null,
      password: null
    };
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };
  
  const {
    fields,
    formError,
    handleChange,
    handleSubmit,
    getFieldId,
    setRequired
  } = useAccessibleForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate,
    onSubmit: async (values) => {
      // Handle login (existing logic)
    }
  });
  
  // Set required fields
  React.useEffect(() => {
    setRequired('email', true);
    setRequired('password', true);
    
    // Focus first form element on mount
    focusFirstElement(formContainerRef);
    
    // Add keyboard trap for modal (if this form is in a modal)
    const handleKeyDown = (e: KeyboardEvent) => {
      trapFocus(e, formContainerRef);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setRequired]);
  
  return (
    <div ref={formContainerRef}>
      <h1 id="login-form-title">Sign In</h1>
      
      {formError && (
        <div
          role="alert"
          className="error-message"
          aria-live="assertive"
        >
          {formError}
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        aria-labelledby="login-form-title"
        noValidate
      >
        <div className="form-group">
          <label htmlFor={getFieldId('email')}>
            Email Address
            {fields.email.required && <span aria-hidden="true"> *</span>}
            {fields.email.required && (
              <span className="sr-only"> (required)</span>
            )}
          </label>
          <input
            type="email"
            id={getFieldId('email')}
            name="email"
            value={fields.email.value}
            onChange={handleChange}
            aria-required={fields.email.required}
            aria-invalid={!!fields.email.error}
            aria-describedby={fields.email.error ? `${getFieldId('email')}-error` : undefined}
          />
          {fields.email.error && (
            <div
              id={`${getFieldId('email')}-error`}
              className="error-message"
              role="alert"
            >
              {fields.email.error}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor={getFieldId('password')}>
            Password
            {fields.password.required && <span aria-hidden="true"> *</span>}
            {fields.password.required && (
              <span className="sr-only"> (required)</span>
            )}
          </label>
          <input
            type="password"
            id={getFieldId('password')}
            name="password"
            value={fields.password.value}
            onChange={handleChange}
            aria-required={fields.password.required}
            aria-invalid={!!fields.password.error}
            aria-describedby={fields.password.error ? `${getFieldId('password')}-error` : undefined}
          />
          {fields.password.error && (
            <div
              id={`${getFieldId('password')}-error`}
              className="error-message"
              role="alert"
            >
              {fields.password.error}
            </div>
          )}
        </div>
        
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Verification Method
1. Test the application with screen readers (NVDA, VoiceOver, etc.)
2. Verify keyboard navigation works throughout the application
3. Test responsive design on various devices and viewport sizes
4. Use automated accessibility tools (Lighthouse, axe) to verify improvements
5. Perform manual testing with assistive technologies
6. Verify color contrast meets WCAG AA standards (at least 4.5:1 for normal text)