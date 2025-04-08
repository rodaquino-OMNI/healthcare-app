import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
// Import wrapper components instead of direct LTHT components
import { Card, DescriptionList, Button } from '../../utils/ltht-component-wrappers';
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
      case 'scheduled':
        return '#cff4fc';
      case 'completed':
        return '#d1e7dd';
      case 'cancelled':
        return '#f8d7da';
      default:
        return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'scheduled':
        return '#055160';
      case 'completed':
        return '#0a3622';
      case 'cancelled':
        return '#842029';
      default:
        return '#41464b';
    }
  }};
`;

const NotesContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #0d6efd;
`;

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
 * Appointment detail page component that shows the details of a specific appointment
 */
const AppointmentDetail: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mock data for appointment details (in a real app, would come from an API service)
    const fetchAppointmentDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data based on appointment ID
        const mockAppointment: Appointment = {
          id: appointmentId || 'appt-001',
          patientId: 'patient-001',
          patientName: 'John Smith',
          providerName: 'Dr. Emily Johnson',
          appointmentType: 'Check-up',
          date: '2025-07-15',
          time: '09:00',
          duration: 30,
          status: 'scheduled',
          location: 'Main Clinic - Room 204',
          notes: 'Patient requested a medication review during this appointment. Bring recent blood test results.'
        };
        
        setAppointment(mockAppointment);
      } catch (err: any) {
        setError(err.message || `Failed to load appointment details for ID: ${appointmentId}`);
        console.error('Error fetching appointment details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointmentDetails();
  }, [appointmentId]);
  
  const handleBackClick = () => {
    navigate('/appointments');
  };
  
  const handleEditClick = () => {
    navigate(`/appointments/${appointmentId}/edit`);
  };
  
  const handleViewPatientClick = () => {
    if (appointment) {
      navigate(`/patients/${appointment.patientId}`);
    }
  };

  const handleCompleteAppointment = () => {
    // In a real application, this would call an API to update the appointment status
    if (appointment) {
      setAppointment({
        ...appointment,
        status: 'completed'
      });
    }
  };

  const handleCancelAppointment = () => {
    // In a real application, this would call an API to update the appointment status
    if (appointment) {
      setAppointment({
        ...appointment,
        status: 'cancelled'
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!appointment) return <ErrorMessage message="Appointment not found" onRetry={() => navigate('/appointments')} />;
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Appointment Details</PageTitle>
        <ButtonContainer>
          <Button variant="secondary" onClick={handleBackClick}>
            Back to Appointments
          </Button>
          {appointment.status === 'scheduled' && (
            <>
              <Button variant="primary" onClick={handleEditClick}>
                Edit Appointment
              </Button>
              <Button variant="success" onClick={handleCompleteAppointment}>
                Mark as Completed
              </Button>
              <Button variant="danger" onClick={handleCancelAppointment}>
                Cancel Appointment
              </Button>
            </>
          )}
        </ButtonContainer>
      </PageHeader>
      
      <Card>
        <Card.Body>
          <DescriptionList>
            <DescriptionList.Item term="Status">
              <StatusBadge status={appointment.status}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </StatusBadge>
            </DescriptionList.Item>
            <DescriptionList.Item term="Date">
              {formatDate(appointment.date)}
            </DescriptionList.Item>
            <DescriptionList.Item term="Time">
              {appointment.time}
            </DescriptionList.Item>
            <DescriptionList.Item term="Duration">
              {appointment.duration} minutes
            </DescriptionList.Item>
            <DescriptionList.Item term="Appointment Type">
              {appointment.appointmentType}
            </DescriptionList.Item>
            <DescriptionList.Item term="Location">
              {appointment.location}
            </DescriptionList.Item>
          </DescriptionList>
          
          {appointment.notes && (
            <NotesContainer>
              <h4>Notes</h4>
              <p>{appointment.notes}</p>
            </NotesContainer>
          )}
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
                {appointment.patientName}
              </Button>
            </DescriptionList.Item>
            <DescriptionList.Item term="Provider">
              {appointment.providerName}
            </DescriptionList.Item>
          </DescriptionList>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default AppointmentDetail;