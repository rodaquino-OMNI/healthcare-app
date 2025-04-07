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

const NotesTextarea = styled.textarea`
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

const TimeSlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TimeSlot = styled.button<{ selected: boolean }>`
  padding: 0.5rem;
  border: 1px solid ${props => props.selected ? '#0d6efd' : '#ced4da'};
  border-radius: 4px;
  background-color: ${props => props.selected ? '#e7f1ff' : 'white'};
  color: ${props => props.selected ? '#0d6efd' : '#212529'};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#d0e3ff' : '#f8f9fa'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f8f9fa;
  }
`;

interface Patient {
  id: string;
  name?: Array<{
    family?: string;
    given?: string[];
  }>;
}

interface Provider {
  id: string;
  name: string;
  speciality: string;
}

interface TimeSlotType {
  time: string;
  available: boolean;
}

/**
 * Appointment scheduling component for creating new appointments
 */
const AppointmentSchedule: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    providerId: '',
    appointmentType: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '30',
    notes: ''
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch patients
        const patientsData = await patientService.getPatients();
        setPatients(patientsData);
        
        // Mock providers data (in a real app, would come from an API)
        const mockProviders: Provider[] = [
          { id: 'provider-001', name: 'Dr. Emily Johnson', speciality: 'General Practice' },
          { id: 'provider-002', name: 'Dr. Michael Chen', speciality: 'Internal Medicine' },
          { id: 'provider-003', name: 'Dr. Sarah Williams', speciality: 'Cardiology' }
        ];
        setProviders(mockProviders);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate time slots when date or provider changes
  useEffect(() => {
    if (formData.date && formData.providerId) {
      // Generate time slots (in a real app, would come from an API based on provider availability)
      const slots: TimeSlotType[] = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Random availability (in a real app, this would be based on the provider's schedule)
          const available = Math.random() > 0.3;
          
          slots.push({ time, available });
        }
      }
      
      setTimeSlots(slots);
    }
  }, [formData.date, formData.providerId]);
  
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
    
    // Clear time selection when date changes
    if (name === 'date') {
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
    }
  };
  
  const handleTimeSlotClick = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
    
    // Clear error when time is selected
    if (formErrors.time) {
      setFormErrors(prev => ({
        ...prev,
        time: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!selectedPatientId) {
      errors.patientId = 'Patient is required';
    }
    
    if (!formData.providerId) {
      errors.providerId = 'Provider is required';
    }
    
    if (!formData.appointmentType) {
      errors.appointmentType = 'Appointment type is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.time) {
      errors.time = 'Time is required';
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
      // In a real app, this would call an API service to save the appointment
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful appointment creation
      console.log('Appointment created:', {
        patientId: selectedPatientId,
        ...formData
      });
      
      // Redirect to the appointments list
      navigate('/appointments');
    } catch (err: any) {
      setError(err.message || 'Failed to schedule appointment');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Navigate back to the previous page
    if (patientId) {
      navigate(`/patients/${patientId}`);
    } else {
      navigate('/appointments');
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
        <PageTitle>Schedule Appointment</PageTitle>
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
              <SectionTitle>Appointment Details</SectionTitle>
              <Form.Group>
                <Form.Label htmlFor="providerId">Provider *</Form.Label>
                <Select
                  id="providerId"
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} ({provider.speciality})
                    </option>
                  ))}
                </Select>
                {formErrors.providerId && <ErrorText>{formErrors.providerId}</ErrorText>}
              </Form.Group>
              
              <Form.Group>
                <Form.Label htmlFor="appointmentType">Appointment Type *</Form.Label>
                <Select
                  id="appointmentType"
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleInputChange}
                >
                  <option value="">Select type</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="New Patient Consultation">New Patient Consultation</option>
                  <option value="Medication Review">Medication Review</option>
                  <option value="Specialist Referral">Specialist Referral</option>
                </Select>
                {formErrors.appointmentType && <ErrorText>{formErrors.appointmentType}</ErrorText>}
              </Form.Group>
              
              <FormRow>
                <Form.Group>
                  <Form.Label htmlFor="date">Date *</Form.Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.date && <ErrorText>{formErrors.date}</ErrorText>}
                </Form.Group>
                
                <Form.Group>
                  <Form.Label htmlFor="duration">Duration (minutes)</Form.Label>
                  <Select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </Select>
                </Form.Group>
              </FormRow>
              
              {formData.date && formData.providerId && (
                <Form.Group>
                  <Form.Label>Available Time Slots *</Form.Label>
                  <TimeSlotContainer>
                    {timeSlots.map((slot, index) => (
                      <TimeSlot
                        key={index}
                        selected={formData.time === slot.time}
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSlotClick(slot.time)}
                        type="button"
                      >
                        {slot.time}
                      </TimeSlot>
                    ))}
                  </TimeSlotContainer>
                  {timeSlots.length === 0 && <p>No time slots available for the selected date and provider.</p>}
                  {formErrors.time && <ErrorText>{formErrors.time}</ErrorText>}
                </Form.Group>
              )}
              
              <Form.Group>
                <Form.Label htmlFor="notes">Notes</Form.Label>
                <NotesTextarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any special instructions or notes..."
                />
              </Form.Group>
            </FormSection>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <Button type="submit" disabled={isLoading} style={{ minWidth: '120px' }}>
                {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </div>
          </StyledForm>
        </Card.Body>
      </Card>
    </PageContainer>
                </Form.Group>
              )}
              
              <Form.Group>
                <Form.Label htmlFor="notes">Notes</Form.Label>
                <NotesTextarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any special instructions or notes..."
                />
              </Form.Group>
            </FormSection>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <Button type="submit" disabled={isLoading} style={{ minWidth: '120px' }}>
                {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </div>
          </StyledForm>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default AppointmentSchedule;