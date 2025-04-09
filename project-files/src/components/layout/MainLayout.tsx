import React from 'react';
import { CustomOutlet } from '../common/router-components';
import styled from '@emotion/styled';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// Styled components for layout
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #f8f9fa;
`;

/**
 * Main layout component that provides the structure for the application
 * Includes header, sidebar, and main content area
 */
const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <LayoutContainer>
      <Header username={user?.name} />
      <ContentContainer>
        <Sidebar />
        <MainContent>
          <CustomOutlet />
        </MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
};

export default MainLayout;
