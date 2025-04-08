import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
// Import wrapper components from the central wrapper location
import { Card, List } from '../../components/ltht-wrappers';
import { patientService } from '../../services/api/patientService';
import PatientListItem from '../../components/patient/PatientListItem';
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

const SearchContainer = styled.div`
  display: flex;
  max-width: 300px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`;

const SearchButton = styled.button`
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0b5ed7;
  }
`;

/**
 * Patient list page component that displays all patients
 */
const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await patientService.getPatients();
        setPatients(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load patients');
        console.error('Error fetching patients:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await patientService.searchPatients(searchTerm);
      setPatients(results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Patients</PageTitle>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <SearchButton onClick={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </SearchButton>
        </SearchContainer>
      </PageHeader>
      
      <Card>
        <Card.Body>
          {patients.length > 0 ? (
            <List>
              {patients.map(patient => (
                <List.Item key={patient.id}>
                  <PatientListItem 
                    patient={patient} 
                    onClick={() => handlePatientClick(patient.id)} 
                  />
                </List.Item>
              ))}
            </List>
          ) : (
            <p>No patients found. Please adjust your search criteria.</p>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default PatientList;