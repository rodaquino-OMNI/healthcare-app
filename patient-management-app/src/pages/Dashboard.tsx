import React from 'react';
import styled from '@emotion/styled';
import { Card, List } from '../components/ltht-wrappers';
import { patientService } from '../services/api/patientService';
import { useAuth } from '../contexts/AuthContext';
import PatientListItem from '../components/patient/PatientListItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// Access React hooks via namespace
const { useState, useEffect } = React;

// Define the Patient interface inline since it's not exported from patientService
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

// Styled components
const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #343a40;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #0d6efd;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

/**
 * Dashboard component that displays a summary of patients, appointments, and statistics
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock statistics data
  const stats = {
    totalPatients: 128,
    todayAppointments: 12,
    pendingPrescriptions: 5,
    activeAlerts: 3
  };

  useEffect(() => {
    const fetchRecentPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, we would fetch recent patients specifically
        const patients = await patientService.getPatients();
        // Limit to 5 patients for the dashboard
        setRecentPatients(patients.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Failed to load recent patients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPatients();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <SectionTitle>Welcome, {user?.name || 'Doctor'}</SectionTitle>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{stats.totalPatients}</StatValue>
          <StatLabel>Total Patients</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.todayAppointments}</StatValue>
          <StatLabel>Today's Appointments</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.pendingPrescriptions}</StatValue>
          <StatLabel>Pending Prescriptions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.activeAlerts}</StatValue>
          <StatLabel>Active Alerts</StatLabel>
        </StatCard>
      </StatsContainer>

      <DashboardContainer>
        <div>
          <SectionTitle>Recent Patients</SectionTitle>
          <Card>
            <Card.Body>
              <List>
                {recentPatients.map(patient => (
                  <List.Item key={patient.id}>
                    <PatientListItem 
                      patient={patient} 
                      onClick={() => window.location.href = `/patients/${patient.id}`} 
                    />
                  </List.Item>
                ))}
                {recentPatients.length === 0 && (
                  <p>No recent patients found.</p>
                )}
              </List>
            </Card.Body>
          </Card>
        </div>
        
        <div>
          <SectionTitle>Today's Schedule</SectionTitle>
          <Card>
            <Card.Body>
              <p>You have {stats.todayAppointments} appointments today.</p>
              <List>
                <List.Item>
                  <div>
                    <strong>9:00 AM</strong> - John Smith (Check-up)
                  </div>
                </List.Item>
                <List.Item>
                  <div>
                    <strong>10:30 AM</strong> - Emma Jones (Follow-up)
                  </div>
                </List.Item>
                <List.Item>
                  <div>
                    <strong>1:45 PM</strong> - Robert Taylor (New Patient)
                  </div>
                </List.Item>
              </List>
            </Card.Body>
          </Card>
        </div>
      </DashboardContainer>
    </div>
  );
};

export default Dashboard;