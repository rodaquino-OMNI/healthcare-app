import React from 'react';
import styled from '@emotion/styled';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
  border: 1px solid #f8d7da;
  background-color: #fff5f5;
  border-radius: 4px;
  margin: 1rem 0;
`;

const ErrorIcon = styled.div`
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  color: #dc3545;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  color: #6c757d;
  text-align: center;
  max-width: 500px;
`;

const RetryButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #c82333;
  }
`;

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

/**
 * Error message component for displaying errors to users
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  title = 'Error', 
  onRetry 
}) => {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
      </ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorText>{message}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;