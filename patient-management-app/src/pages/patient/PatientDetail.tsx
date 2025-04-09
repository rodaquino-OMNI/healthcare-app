import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
// Import wrapper components from the central wrapper location
import {
  PatientBanner,
  FlagDetail,
  AllergyDetail,
  Card,
  Button,
  DescriptionList
} from '../../components/ltht-wrappers';
import { usePatients } from '../../contexts/PatientContext';
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SectionHeading = styled.h2`
  font-size: 1.25rem;
  color: #212529;
  margin: 1.5rem 0 1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DetailCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

/**
 * Patient detail page component that displays comprehensive information about a patient
 */
const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentPatient: patient, isLoading, error, loadPatient } = usePatients();
  const navigate = useNavigate();

  // Load patient data when component mounts
  React.useEffect(() => {
    if (patientId) {
      loadPatient(patientId);
    }
  }, [patientId, loadPatient]);

  const handleBackClick = () => {
    navigate('/patients');
  };

  const handlePrescribeClick = () => {
    navigate(`/patients/${patientId}/prescribe`);
  };

  const handleScheduleClick = () => {
    navigate(`/patients/${patientId}/schedule`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => loadPatient(patientId)} />;
  if (!patient) return <ErrorMessage message="Patient not found" onRetry={() => navigate('/patients')} />;

  // Format patient name
  const patientName = patient.firstName && patient.lastName
    ? `${patient.firstName} ${patient.lastName}`
    : 'Unknown Patient';

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Patient Details</PageTitle>
        <ActionButtons>
          <Button variant="secondary" onClick={handleBackClick}>
            Back to Patients
          </Button>
          <Button variant="primary" onClick={handlePrescribeClick}>
            Prescribe Medication
          </Button>
          <Button variant="primary" onClick={handleScheduleClick}>
            Schedule Appointment
          </Button>
        </ActionButtons>
      </PageHeader>

      {patient && (
        <>
          <PatientBanner 
            patient={{
              fullName: patientName,
              gender: patient.gender || 'Unknown',
              nhsNumber: patient.id || 'Unknown',
              dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined,
              gpDetails: {},
            }}
          />

          <ContentGrid>
            <div>
              <SectionHeading>Patient Information</SectionHeading>
              <DetailCard>
                <Card.Body>
                  <DescriptionList>
                    <DescriptionList.Item term="Full Name">
                      {patientName}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="ID">
                      {patient.id || 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Date of Birth">
                      {patient.dateOfBirth || 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Gender">
                      {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Address">
                      {patient.address || 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Phone">
                      {patient.phoneNumber || 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Email">
                      {patient.email || 'Not available'}
                    </DescriptionList.Item>
                  </DescriptionList>
                </Card.Body>
              </DetailCard>
            </div>

            <div>
              <SectionHeading>Allergies</SectionHeading>
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map(allergy => (
                  <DetailCard key={allergy}>
                    <Card.Body>
                      <p>{allergy}</p>
                    </Card.Body>
                  </DetailCard>
                ))
              ) : (
                <DetailCard>
                  <Card.Body>
                    <p>No allergies recorded for this patient.</p>
                  </Card.Body>
                </DetailCard>
              )}
            </div>
          </ContentGrid>

          <SectionHeading>Medical History</SectionHeading>
          <DetailCard>
            <Card.Body>
              <p>{patient.medicalHistory || 'No medical history recorded for this patient.'}</p>
            </Card.Body>
          </DetailCard>
        </>
      )}
    </PageContainer>
  );
};

export default PatientDetail;