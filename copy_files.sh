#!/bin/bash

# Copy layout components
cp project-files/src/components/layout/Header.tsx patient-management-app/src/components/layout/
cp project-files/src/components/layout/MainLayout.tsx patient-management-app/src/components/layout/
cp project-files/src/components/layout/Sidebar.tsx patient-management-app/src/components/layout/

# Copy patient components
cp project-files/src/components/patient/PatientListItem.tsx patient-management-app/src/components/patient/

# Copy contexts
cp project-files/src/contexts/AuthContext.tsx patient-management-app/src/contexts/
cp project-files/src/contexts/PatientContext.tsx patient-management-app/src/contexts/

# Copy pages
cp project-files/src/pages/Dashboard.tsx patient-management-app/src/pages/
cp project-files/src/pages/Login.tsx patient-management-app/src/pages/

# Copy services
cp project-files/src/services/api/patientService.ts patient-management-app/src/services/api/
cp project-files/src/services/auth/authService.ts patient-management-app/src/services/auth/

# Copy README
cp project-files/README.md patient-management-app/
