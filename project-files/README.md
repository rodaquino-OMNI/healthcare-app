# Patient Management System

A healthcare application built with React using ltht-react components, focusing on medication management and prescription workflows.

## Overview

This application provides a comprehensive patient management system for healthcare providers, allowing them to:

- View and manage patient records
- Track allergies and alerts
- Manage medications and prescriptions
- Schedule and track appointments

The system is built on React and utilizes FHIR-compatible data structures through the ltht-react component library.

## Features

- **Patient Management**: View patient profiles, medical history, and demographic information
- **Medication Management**: Track current medications and prescription history
- **Prescription Workflow**: Create and manage prescriptions with allergy safety checks
- **Appointment Scheduling**: Schedule and track patient appointments
- **OAuth2 Authentication**: Secure authentication system with role-based access control

## Technology Stack

- **Frontend**: React 18, TypeScript, Emotion (CSS-in-JS)
- **UI Components**: ltht-react component library (FHIR-compatible healthcare components)
- **State Management**: React Context API
- **Routing**: React Router v6
- **API Integration**: Axios with FHIR-compatible endpoints
- **Authentication**: OAuth2 with JWT
- **Testing**: Jest, React Testing Library

## Development

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-org/patient-management-system.git
   cd patient-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_USE_MOCK=true
```

Set `REACT_APP_USE_MOCK=true` for development with mock data or `false` to connect to a real API.

## Deployment

### AWS Cloud Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to S3:
   ```
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

3. Invalidate CloudFront cache (if using CloudFront):
   ```
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## Security and Compliance

- All patient data is encrypted in transit using TLS/SSL
- Authentication using OAuth2 with secure token storage
- HIPAA and GDPR compliance built into the data handling processes

## License

This project is licensed under the MIT License - see the LICENSE file for details.