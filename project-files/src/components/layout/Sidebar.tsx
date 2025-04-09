import React from 'react';
import { CustomNavLink } from '../common/router-components';
import styled from '@emotion/styled';

// Styled components for sidebar
const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  height: calc(100vh - 60px); /* Subtract header height */
  overflow-y: auto;
`;

const SidebarNav = styled.nav`
  padding: 1rem 0;
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #6c757d;
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
`;

const NavItem = styled(CustomNavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background-color: #e9ecef;
  }
  
  &.active {
    background-color: #e9ecef;
    color: #0d6efd;
    font-weight: 500;
    border-right: 3px solid #0d6efd;
  }
`;

/**
 * Sidebar component with navigation links
 */
const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SidebarNav>
        <NavSection>
          <SectionTitle>Main</SectionTitle>
          <NavItem to="/">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </NavItem>
        </NavSection>

        <NavSection>
          <SectionTitle>Patients</SectionTitle>
          <NavItem to="/patients">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Patient List
          </NavItem>
        </NavSection>

        <NavSection>
          <SectionTitle>Medications</SectionTitle>
          <NavItem to="/medications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Medications
          </NavItem>
        </NavSection>

        <NavSection>
          <SectionTitle>Schedule</SectionTitle>
          <NavItem to="/appointments">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Appointments
          </NavItem>
        </NavSection>
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;
