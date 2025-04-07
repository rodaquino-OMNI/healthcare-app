import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Card } from '@ltht-react/card';
import { DescriptionList } from '@ltht-react/description-list';
import { Button } from '@ltht-react/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

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

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SectionHeader = styled.h2`
  font-size: 1.25rem;
  color: #212529;
  margin: 1.5rem 0 1rem;
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
  startDate: string;
  endDate?: string;
  instructions?: string;
  patientId: string;
  patientName: string;
  prescribedBy: string;
}

/**
 * Medication detail page component that displays medication details
 */
const MedicationDetail: React.FC = () => {
  const { medicationId } = useParams<{ medicationId: string }>();
  const [medication, setMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mock data for medication details (in a real app, would come from an API service)
    const fetchMedicationDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data based on medication ID
        const mockMedication: Medication = {
          id: medicationId || 'med-001',
          name: 'Lisinopril',
          status: 'active',
          dosage: '10mg',
          frequency: 'Once daily',
          prescribedDate: '2025-03-15',
          startDate: '2025-03-16',
          endDate: '2025-06-16',
          instructions: 'Take in the morning with water. Avoid taking with grapefruit juice.',
          patientId: 'patient-001',
          patientName: 'John Smith',
          prescribedBy: 'Dr. Emily Johnson'
        };
        
        setMedication(mockMedication);
      } catch (err: any) {
        setError(err.message || `Failed to load medication details for ID: ${medicationId}`);
        console.error('Error fetching medication details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicationDetails();
  }, [medicationId]);
  
  const handleBackClick = () => {
    navigate('/medications');
  };
  
  const handleEditClick = () => {
    navigate(`/medications/${medicationId}/edit`);
  };
  
  const handleViewPatientClick = () => {
    if (medication) {
      navigate(`/patients/${medication.patientId}`);
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!medication) return <ErrorMessage message="Medication not found" onRetry={() => navigate('/medications')} />;
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Medication Details</PageTitle>
        <ButtonContainer>
          <Button variant="secondary" onClick={handleBackClick}>
            Back to Medications
          </Button>
          <Button variant="primary" onClick={handleEditClick}>
            Edit Medication
          </Button>
        </ButtonContainer>
      </PageHeader>
      
      <Card>
        <Card.Body>
          <DescriptionList>
            <DescriptionList.Item term="Medication Name">
              {medication.name}
            </DescriptionList.Item>
            <DescriptionList.Item term="Status">
              <StatusBadge status={medication.status}>
                {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
              </StatusBadge>
            </DescriptionList.Item>
            <DescriptionList.Item term="Dosage">
              {medication.dosage}
            </DescriptionList.Item>
            <DescriptionList.Item term="Frequency">
              {medication.frequency}
            </DescriptionList.Item>
            <DescriptionList.Item term="Prescribed Date">
              {medication.prescribedDate}
            </DescriptionList.Item>
            <DescriptionList.Item term="Start Date">
              {medication.startDate}
            </DescriptionList.Item>
            <DescriptionList.Item term="End Date">
              {medication.endDate || 'Ongoing'}
            </DescriptionList.Item>
            {medication.instructions && (
              <DescriptionList.Item term="Instructions">
                {medication.instructions}
              </DescriptionList.Item>
            )}
          </DescriptionList>
        </Card.Body>
      </Card>
      
      <SectionHeader>Patient Information</SectionHeader>
      <Card>
        <Card.Body>
          <DescriptionList>
            <DescriptionList.Item term="Patient Name">
              <Button 
                variant="link" 
                onClick={handleViewPatientClick} 
                style={{ padding: 0, textDecoration: 'underline' }}
              >
                {medication.patientName}
              </Button>
            </DescriptionList.Item>
            <DescriptionList.Item term="Prescribed By">
              {medication.prescribedBy}
            </DescriptionList.Item>
          </DescriptionList>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default MedicationDetail;