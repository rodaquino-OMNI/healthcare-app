import axios from 'axios';
import { authService } from '../auth/authService';

// API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

// Basic Patient type definition - would import from @ltht-react/types in the real implementation
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

/**
 * Service for Patient resource operations
 */
export const patientService = {
  /**
   * Get all patients (with optional search parameters)
   */
  getPatients: async (searchParams?: Record<string, string>): Promise<Patient[]> => {
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return mock patients from mock data
        // In a real implementation, this would connect to the mockPatientService
        return [
          {
            id: 'patient-001',
            identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000001' }],
            name: [
              {
                family: 'Smith',
                given: ['John', 'William'],
                use: 'official',
              },
            ],
            gender: 'male',
            birthDate: '1980-01-15',
          },
          {
            id: 'patient-002',
            identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000002' }],
            name: [
              {
                family: 'Jones',
                given: ['Emma'],
                use: 'official',
              },
            ],
            gender: 'female',
            birthDate: '1975-06-20',
          },
          {
            id: 'patient-003',
            identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000003' }],
            name: [
              {
                family: 'Taylor',
                given: ['Robert'],
                use: 'official',
              },
            ],
            gender: 'male',
            birthDate: '1990-11-05',
          },
        ];
      }
      
      // Real API call with auth token
      const token = authService.getToken();
      const response = await axios.get(`${API_BASE_URL}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: searchParams
      });
      
      return response.data.patients;
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  },
  
  /**
   * Get a single patient by ID
   */
  getPatient: async (patientId: string): Promise<Patient> => {
    try {
      // For development/prototype phase
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock patient data with flags and allergies
        const mockPatient: Patient = {
          id: patientId,
          identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000001' }],
          name: [
            {
              family: 'Smith',
              given: ['John', 'William'],
              use: 'official',
            },
          ],
          gender: 'male',
          birthDate: '1980-01-15',
          address: [
            {
              line: ['123 Main St'],
              city: 'London',
              postalCode: 'W1 1AA',
            },
          ],
          telecom: [
            {
              system: 'phone',
              value: '07700 900123',
              use: 'mobile',
            },
            {
              system: 'email',
              value: 'john.smith@example.com',
            },
          ],
          // Mock flags
          flags: [
            {
              id: 'flag-001',
              status: 'active',
              category: [
                {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/flag-category',
                      code: 'clinical',
                      display: 'Clinical',
                    },
                  ],
                },
              ],
              code: {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '390952000',
                    display: 'Diabetes Mellitus Type 2',
                  },
                ],
                text: 'Diabetes Mellitus Type 2',
              },
              subject: {
                reference: `Patient/${patientId}`,
              },
              period: {
                start: '2020-01-01',
              },
            },
          ],
          // Mock allergies
          allergies: [
            {
              id: 'allergy-001',
              clinicalStatus: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
                    code: 'active',
                    display: 'Active',
                  },
                ],
              },
              type: 'allergy',
              category: ['medication'],
              criticality: 'high',
              code: {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '372687004',
                    display: 'Penicillin',
                  },
                ],
                text: 'Penicillin',
              },
              patient: {
                reference: `Patient/${patientId}`,
              },
              onsetDateTime: '2018-04-05',
              reaction: [
                {
                  manifestation: [
                    {
                      coding: [
                        {
                          system: 'http://snomed.info/sct',
                          code: '247472004',
                          display: 'Hives',
                        },
                      ],
                      text: 'Hives',
                    },
                  ],
                  severity: 'severe',
                },
              ],
            },
          ],
        };
        
        return mockPatient;
      }
      
      // Real API call with auth token
      const token = authService.getToken();
      const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.patient;
    } catch (error: any) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw new Error(error.response?.data?.message || `Failed to fetch patient ${patientId}`);
    }
  },
  
  /**
   * Search patients by term
   */
  searchPatients: async (searchTerm: string): Promise<Patient[]> => {
    // This would be an implementation for a dedicated search endpoint
    // For now, we'll use the getPatients with query parameters
    return patientService.getPatients({ search: searchTerm });
  },
};

export default patientService;