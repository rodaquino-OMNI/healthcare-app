import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../../contexts/AuthContext';
import { ARIA_LABELS } from '../../utils/accessibility';

// Styled components for header
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #2c3e50;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  
  svg {
    margin-right: 0.75rem;
  }
  
  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-right: 1rem;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

interface HeaderProps {
  username?: string;
}

/**
 * Application header component with logo and user controls
 */
const Header: React.FC<HeaderProps> = ({ username = 'User' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };
  
  const handleKeyboardLogoClick = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <HeaderContainer role="banner">
      <Logo 
        onClick={handleLogoClick}
        onKeyDown={handleKeyboardLogoClick}
        tabIndex={0}
        role="button"
        aria-label="Go to dashboard"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" 
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Patient Manager
      </Logo>
      
      <UserSection aria-live="polite">
        <UserName>Welcome, {username}</UserName>
        <LogoutButton 
          onClick={handleLogout}
          aria-label={ARIA_LABELS.CLOSE}
        >
          Logout
        </LogoutButton>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;