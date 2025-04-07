import React from 'react';
import styled from '@emotion/styled';

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #0d6efd; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6c757d;
  font-size: 1rem;
`;

interface LoadingSpinnerProps {
  text?: string;
}

/**
 * Loading spinner component for displaying loading states
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...' 
}) => {
  return (
    <SpinnerContainer>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;