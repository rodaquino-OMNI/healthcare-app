import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PatientProvider } from './contexts/PatientContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { SkipLink } from './components/common/SkipLink';

// Page imports
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Patient pages
import PatientList from './pages/patient/PatientList';
import PatientDetail from './pages/patient/PatientDetail';

// Medication pages
import MedicationList from './pages/medication/MedicationList';
import MedicationDetail from './pages/medication/MedicationDetail';
import PrescriptionForm from './pages/medication/PrescriptionForm';

// Appointment pages
import AppointmentList from './pages/appointment/AppointmentList';
import AppointmentDetail from './pages/appointment/AppointmentDetail';
import AppointmentSchedule from './pages/appointment/AppointmentSchedule';

const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* Add skip link for keyboard accessibility */}
      <SkipLink targetId="main-content" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Patient routes */}
          <Route path="patients">
            <Route index element={<PatientList />} />
            <Route
              path=":patientId"
              element={
                <PatientProvider>
                  <PatientDetail />
                </PatientProvider>
              }
            />
            <Route
              path=":patientId/prescribe"
              element={<PrescriptionForm />}
            />
            <Route
              path=":patientId/schedule"
              element={<AppointmentSchedule />}
            />
          </Route>
          
          {/* Medication routes */}
          <Route path="medications">
            <Route index element={<MedicationList />} />
            <Route path=":medicationId" element={<MedicationDetail />} />
          </Route>
          
          {/* Appointment routes */}
          <Route path="appointments">
            <Route index element={<AppointmentList />} />
            <Route path=":appointmentId" element={<AppointmentDetail />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;