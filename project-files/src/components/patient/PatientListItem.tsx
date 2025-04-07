import React from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';

// Define a simplified Patient interface for this component
// In a full implementation, we would import from @ltht-react/types
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
}

interface PatientListItemProps {
  patient: Patient;
  onClick: () => void;
}

// Styled components
const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
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

const PatientInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.div`
  font-weight: 500;
  font-size: 1rem;
  color: #212529;
  margin-bottom: 0.25rem;
`;

const PatientDetails = styled.div`
  display: flex;
  color: #6c757d;
  font-size: 0.875rem;
  
  > div {
    margin-right: 1rem;
  }
`;

const ChevronIcon = styled.div`
  color: #adb5bd;
`;

/**
 * Component to display a patient in a list with basic information
 */
const PatientListItem: React.FC<PatientListItemProps> = ({ patient, onClick }) => {
  // Format the patient's name
  const patientName = patient.name && patient.name.length > 0
    ? `${patient.name[0].given?.join(' ') || ''} ${patient.name[0].family || ''}`
    : 'Unknown Patient';
  
  // Get NHS number if available
  const nhsNumber = patient.identifier
    ? patient.identifier.find(id => id.system === 'https://fhir.nhs.uk/Id/nhs-number')?.value
    : null;
  
  // Format birthdate
  const formattedBirthDate = patient.birthDate
    ? format(new Date(patient.birthDate), 'dd/MM/yyyy')
    : 'Unknown';
  
  return (
    <Container onClick={onClick}>
      <PatientInfo>
        <PatientName>{patientName}</PatientName>
        <PatientDetails>
          {nhsNumber && <div>NHS: {nhsNumber}</div>}
          <div>DOB: {formattedBirthDate}</div>
          {patient.gender && <div>Gender: {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</div>}
        </PatientDetails>
      </PatientInfo>
      <ChevronIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </ChevronIcon>
    </Container>
  );
};

export default PatientListItem;