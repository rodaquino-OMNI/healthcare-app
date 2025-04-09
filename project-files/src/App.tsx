import React from 'react';
import { CustomRoutes, CustomRoute, CustomNavigate } from './components/common/router-components';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Page imports
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

/**
 * Main application component
 * Uses custom router components to avoid TypeScript errors
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <CustomRoutes>
        <CustomRoute path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <CustomRoute
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <CustomRoute index element={<Dashboard />} />
          
          {/* Fallback route */}
          <CustomRoute path="*" element={<CustomNavigate to="/" replace />} />
        </CustomRoute>
      </CustomRoutes>
    </AuthProvider>
  );
};

export default App;
