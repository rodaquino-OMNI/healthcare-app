import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Card } from '@ltht-react/card';
import { Button } from '@ltht-react/button';
import { Form } from '@ltht-react/form';
import { Input } from '@ltht-react/input';
import { Select } from '@ltht-react/select';
import { patientService } from '../../services/api/patientService';
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

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  > * {
    flex: 1;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
`;

const InstructionsTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 100px;
  font-family: inherit;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

interface Patient {
  id: string;
  name?: Array<{
    family?: string;
    given?: string[];
  }>;
}

/**
 * Prescription form component for creating or editing medication prescriptions
 */
const PrescriptionForm: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    status: 'active'
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const patientsData = await patientService.getPatients();
        setPatients(patientsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load patients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!selectedPatientId) {
      errors.patientId = 'Patient is required';
    }
    
    if (!formData.medicationName.trim()) {
      errors.medicationName = 'Medication name is required';
    }
    
    if (!formData.dosage.trim()) {
      errors.dosage = 'Dosage is required';
    }
    
    if (!formData.frequency.trim()) {
      errors.frequency = 'Frequency is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API service to save the prescription
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful prescription creation
      console.log('Prescription created:', {
        patientId: selectedPatientId,
        ...formData
      });
      
      // Redirect to the patient details page or medication list
      if (selectedPatientId) {
        navigate(`/patients/${selectedPatientId}`);
      } else {
        navigate('/medications');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create prescription');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Navigate back to the previous page
    if (patientId) {
      navigate(`/patients/${patientId}`);
    } else {
      navigate('/medications');
    }
  };
  
  if (isLoading && patients.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  
  // Format patient name for display
  const getPatientName = (patient: Patient): string => {
    if (!patient.name || patient.name.length === 0) return 'Unknown Patient';
    const name = patient.name[0];
    return `${name.given?.join(' ') || ''} ${name.family || ''}`.trim();
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Create Prescription</PageTitle>
        <ButtonContainer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </PageHeader>
      
      <Card>
        <Card.Body>
          <StyledForm onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Patient Information</SectionTitle>
              <Form.Group>
                <Form.Label htmlFor="patientId">Patient *</Form.Label>
                <Select
                  id="patientId"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  disabled={!!patientId}
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {getPatientName(patient)}
                    </option>
                  ))}
                </Select>
                {formErrors.patientId && <ErrorText>{formErrors.patientId}</ErrorText>}
              </Form.Group>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Medication Details</SectionTitle>
              <Form.Group>
                <Form.Label htmlFor="medicationName">Medication Name *</Form.Label>
                <Input
                  id="medicationName"
                  name="medicationName"
                  value={formData.medicationName}
                  onChange={handleInputChange}
                />
                {formErrors.medicationName && <ErrorText>{formErrors.medicationName}</ErrorText>}
              </Form.Group>
              
              <FormRow>
                <Form.Group>
                  <Form.Label htmlFor="dosage">Dosage *</Form.Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 10mg"
                  />
                  {formErrors.dosage && <ErrorText>{formErrors.dosage}</ErrorText>}
                </Form.Group>
                
                <Form.Group>
                  <Form.Label htmlFor="frequency">Frequency *</Form.Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="e.g., Once daily"
                  />
                  {formErrors.frequency && <ErrorText>{formErrors.frequency}</ErrorText>}
                </Form.Group>
              </FormRow>
              
              <FormRow>
                <Form.Group>
                  <Form.Label htmlFor="startDate">Start Date *</Form.Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {formErrors.startDate && <ErrorText>{formErrors.startDate}</ErrorText>}
                </Form.Group>
                
                <Form.Group>
                  <Form.Label htmlFor="endDate">End Date</Form.Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </FormRow>
              
              <Form.Group>
                <Form.Label htmlFor="status">Status</Form.Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="stopped">Stopped</option>
                </Select>
              </Form.Group>
              
              <Form.Group>
                <Form.Label htmlFor="instructions">Instructions</Form.Label>
                <InstructionsTextarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Enter special instructions or notes..."
                />
              </Form.Group>
            </FormSection>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <Button type="submit" disabled={isLoading} style={{ minWidth: '120px' }}>
                {isLoading ? 'Saving...' : 'Create Prescription'}
              </Button>
            </div>
          </StyledForm>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default PrescriptionForm;