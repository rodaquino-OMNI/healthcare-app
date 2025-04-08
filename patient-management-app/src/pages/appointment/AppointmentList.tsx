import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
// Import wrapper components instead of direct LTHT components
import { Card, List, Button } from '../../utils/ltht-component-wrappers';
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

const AppointmentItem = styled.div`
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

const AppointmentInfo = styled.div`
  flex: 1;
`;

const AppointmentTitle = styled.div`
  font-weight: 500;
  font-size: 1rem;
  color: #212529;
  margin-bottom: 0.25rem;
`;

const AppointmentDetails = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
`;

const DateTimeContainer = styled.div`
  min-width: 120px;
  text-align: right;
  margin-right: 1rem;
`;

const DateText = styled.div`
  font-weight: 500;
  color: #212529;
`;

const TimeText = styled.div`
  color: #6c757d;
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
  notes?: string;
}

/**
 * Appointment list page component that displays all appointments
 */
const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mock data for appointments (in a real app, would come from an API service)
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock appointment data
        const mockAppointments: Appointment[] = [
          {
            id: 'appt-001',
            patientId: 'patient-001',
            patientName: 'John Smith',
            providerName: 'Dr. Emily Johnson',
            appointmentType: 'Check-up',
            date: '2025-07-15',
            time: '09:00',
            duration: 30,
            status: 'scheduled'
          },
          {
            id: 'appt-002',
            patientId: 'patient-002',
            patientName: 'Emma Jones',
            providerName: 'Dr. Emily Johnson',
            appointmentType: 'Follow-up',
            date: '2025-07-15',
            time: '10:30',
            duration: 45,
            status: 'scheduled'
          },
          {
            id: 'appt-003',
            patientId: 'patient-003',
            patientName: 'Robert Taylor',
            providerName: 'Dr. Michael Chen',
            appointmentType: 'New Patient Consultation',
            date: '2025-07-15',
            time: '13:45',
            duration: 60,
            status: 'scheduled'
          },
          {
            id: 'appt-004',
            patientId: 'patient-001',
            patientName: 'John Smith',
            providerName: 'Dr. Emily Johnson',
            appointmentType: 'Medication Review',
            date: '2025-07-12',
            time: '14:00',
            duration: 20,
            status: 'completed'
          },
          {
            id: 'appt-005',
            patientId: 'patient-004',
            patientName: 'Sarah Wilson',
            providerName: 'Dr. Michael Chen',
            appointmentType: 'Consultation',
            date: '2025-07-11',
            time: '11:15',
            duration: 30,
            status: 'cancelled',
            notes: 'Patient requested to reschedule'
          }
        ];
        
        setAppointments(mockAppointments);
      } catch (err: any) {
        setError(err.message || 'Failed to load appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  // Apply filters
  const getFilteredAppointments = () => {
    let filtered = [...appointments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      
      if (dateFilter === 'today') {
        filtered = filtered.filter(appt => appt.date === today);
      } else if (dateFilter === 'upcoming') {
        filtered = filtered.filter(appt => appt.date >= today && appt.status === 'scheduled');
      } else if (dateFilter === 'past') {
        filtered = filtered.filter(appt => appt.date < today || appt.status === 'completed');
      }
    }
    
    return filtered;
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  const handleAppointmentClick = (appointmentId: string) => {
    navigate(`/appointments/${appointmentId}`);
  };
  
  const handleScheduleClick = () => {
    navigate('/appointments/schedule');
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Appointments</PageTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <FilterContainer>
            <FilterSelect 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </FilterSelect>
            
            <FilterSelect 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </FilterSelect>
          </FilterContainer>
          
          <Button variant="primary" onClick={handleScheduleClick}>
            Schedule Appointment
          </Button>
        </div>
      </PageHeader>
      
      <Card>
        <Card.Body>
          {filteredAppointments.length > 0 ? (
            <List>
              {filteredAppointments.map(appointment => (
                <List.Item key={appointment.id}>
                  <AppointmentItem onClick={() => handleAppointmentClick(appointment.id)}>
                    <DateTimeContainer>
                      <DateText>{formatDate(appointment.date)}</DateText>
                      <TimeText>{appointment.time}</TimeText>
                    </DateTimeContainer>
                    
                    <AppointmentInfo>
                      <AppointmentTitle>{appointment.appointmentType}</AppointmentTitle>
                      <AppointmentDetails>
                        <div>Patient: {appointment.patientName}</div>
                        <div>Provider: {appointment.providerName}</div>
                        <div>Duration: {appointment.duration} minutes</div>
                      </AppointmentDetails>
                    </AppointmentInfo>
                    
                    <StatusBadge status={appointment.status}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </StatusBadge>
                  </AppointmentItem>
                </List.Item>
              ))}
            </List>
          ) : (
            <p>No appointments found with the selected filters.</p>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default AppointmentList;