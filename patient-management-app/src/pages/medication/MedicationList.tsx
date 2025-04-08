import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
// Import wrapper components instead of direct LTHT components
import { Card, List } from '../../utils/ltht-component-wrappers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

// Access React APIs via namespace
const { useState, useEffect } = React;

// Styled components
const PageContainer = styled.div`
  padding: 1rem 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #212529;
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`;

const MedicationItem = styled.div`
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const MedicationInfo = styled.div`
  flex: 1;
`;

const MedicationName = styled.div`
  font-weight: 500;
  font-size: 1rem;
  color: #212529;
  margin-bottom: 0.25rem;
`;

const MedicationDetails = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#d1e7dd';
      case 'completed':
        return '#cff4fc';
      case 'stopped':
        return '#f8d7da';
      default:
        return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active':
        return '#0a3622';
      case 'completed':
        return '#055160';
      case 'stopped':
        return '#842029';
      default:
        return '#41464b';
    }
  }};
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
 * Medication list page component that displays all medications
 */
const MedicationList: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mock data for medications (in a real app, would come from an API service)
    const fetchMedications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock medication data
        const mockMedications: Medication[] = [
          {
            id: 'med-001',
            name: 'Lisinopril',
            status: 'active',
            dosage: '10mg',
            frequency: 'Once daily',
            prescribedDate: '2025-03-15',
            patientId: 'patient-001',
            patientName: 'John Smith'
          },
          {
            id: 'med-002',
            name: 'Atorvastatin',
            status: 'active',
            dosage: '20mg',
            frequency: 'Once daily at bedtime',
            prescribedDate: '2025-03-10',
            patientId: 'patient-001',
            patientName: 'John Smith'
          },
          {
            id: 'med-003',
            name: 'Amoxicillin',
            status: 'completed',
            dosage: '500mg',
            frequency: 'Three times daily',
            prescribedDate: '2025-02-20',
            patientId: 'patient-002',
            patientName: 'Emma Jones'
          },
          {
            id: 'med-004',
            name: 'Ibuprofen',
            status: 'stopped',
            dosage: '400mg',
            frequency: 'As needed for pain',
            prescribedDate: '2025-01-05',
            patientId: 'patient-003',
            patientName: 'Robert Taylor'
          }
        ];
        
        setMedications(mockMedications);
      } catch (err: any) {
        setError(err.message || 'Failed to load medications');
        console.error('Error fetching medications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, []);
  
  // Apply status filter
  const filteredMedications = statusFilter === 'all'
    ? medications
    : medications.filter(med => med.status === statusFilter);
  
  const handleMedicationClick = (medicationId: string) => {
    navigate(`/medications/${medicationId}`);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Medications</PageTitle>
        <FilterContainer>
          <FilterSelect 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="stopped">Stopped</option>
          </FilterSelect>
        </FilterContainer>
      </PageHeader>
      
      <Card>
        <Card.Body>
          {filteredMedications.length > 0 ? (
            <List>
              {filteredMedications.map(medication => (
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
          ) : (
            <p>No medications found with the selected filter.</p>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default MedicationList;