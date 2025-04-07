import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { PatientBanner } from '@ltht-react/patient-banner';
import { FlagDetail } from '@ltht-react/flag-detail';
import { AllergyDetail } from '@ltht-react/allergy-detail';
import { Card } from '@ltht-react/card';
import { Button } from '@ltht-react/button';
import { DescriptionList } from '@ltht-react/description-list';
import { usePatient } from '../../contexts/PatientContext';
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
  const { patient, isLoading, error } = usePatient();
  const navigate = useNavigate();
  
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
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!patient) return <ErrorMessage message="Patient not found" onRetry={() => navigate('/patients')} />;
  
  // Format patient name
  const patientName = patient.name && patient.name.length > 0
    ? `${patient.name[0].given?.join(' ') || ''} ${patient.name[0].family || ''}`
    : 'Unknown Patient';

  // Get NHS number if available
  const nhsNumber = patient.identifier
    ? patient.identifier.find(id => id.system === 'https://fhir.nhs.uk/Id/nhs-number')?.value
    : null;
  
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
              nhsNumber: nhsNumber || 'Unknown',
              dateOfBirth: patient.birthDate ? new Date(patient.birthDate) : undefined,
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
                    <DescriptionList.Item term="NHS Number">
                      {nhsNumber || 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Date of Birth">
                      {patient.birthDate || 'Not available'}
                    </DescriptionList.Item>
                    <DescriptionList.Item term="Gender">
                      {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not available'}
                    </DescriptionList.Item>
                    {patient.address && patient.address.length > 0 && (
                      <DescriptionList.Item term="Address">
                        {patient.address[0].line?.join(', ')}{patient.address[0].city ? `, ${patient.address[0].city}` : ''}
                        {patient.address[0].postalCode ? `, ${patient.address[0].postalCode}` : ''}
                      </DescriptionList.Item>
                    )}
                    {patient.telecom && patient.telecom.length > 0 && (
                      <DescriptionList.Item term="Contact">
                        {patient.telecom.map((t, i) => (
                          <div key={i}>
                            {t.system && t.system.charAt(0).toUpperCase() + t.system.slice(1)}: {t.value}
                            {t.use && ` (${t.use})`}
                          </div>
                        ))}
                      </DescriptionList.Item>
                    )}
                  </DescriptionList>
                </Card.Body>
              </DetailCard>
            </div>
            
            <div>
              <SectionHeading>Allergies</SectionHeading>
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map(allergy => (
                  <DetailCard key={allergy.id}>
                    <Card.Body>
                      <AllergyDetail allergy={allergy} />
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
          
          <SectionHeading>Patient Flags</SectionHeading>
          {patient.flags && patient.flags.length > 0 ? (
            patient.flags.map(flag => (
              <DetailCard key={flag.id}>
                <Card.Body>
                  <FlagDetail flag={flag} />
                </Card.Body>
              </DetailCard>
            ))
          ) : (
            <DetailCard>
              <Card.Body>
                <p>No flags recorded for this patient.</p>
              </Card.Body>
            </DetailCard>
          )}
        </>
      )}
    </PageContainer>
        </>
      )}
    </PageContainer>
  );
};

export default PatientDetail;