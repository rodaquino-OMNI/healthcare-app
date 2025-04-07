# Patient Management System

A comprehensive healthcare application for managing patients, medications, and appointments built with React and TypeScript.

## Features

- **Patient Management**:
  - View patient list and search functionality
  - Detailed patient profiles with medical history
  - Patient flags and allergy information

- **Medication Management**:
  - Medication tracking and history
  - Prescription workflow
  - Medication status monitoring

- **Appointment Scheduling**:
  - Calendar view of appointments
  - Appointment creation and management
  - Provider availability checking

## Project Structure

```
/patient-management-app
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Common components (LoadingSpinner, ErrorMessage, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   ├── patient/        # Patient-related components
│   │   ├── medication/     # Medication-related components
│   │   └── appointment/    # Appointment-related components
│   ├── contexts/           # React Context providers
│   ├── pages/              # Page components
│   │   ├── patient/        # Patient-related pages
│   │   ├── medication/     # Medication-related pages
│   │   └── appointment/    # Appointment-related pages
│   ├── services/           # API services
│   │   ├── api/            # API client and services
│   │   └── auth/           # Authentication services
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   ├── index.tsx           # Entry point
│   └── theme.ts            # Theme configuration
└── package.json            # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/patient-management-system.git
cd patient-management-system
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to http://localhost:3000

### Testing

Run the test suite with:
```bash
npm test
```

## Dependencies

This project uses the Leeds Teaching Hospitals NHS Trust React component library (`@ltht-react/*`) for consistent styling and functionality across healthcare applications. Main dependencies include:

- React 18
- TypeScript
- React Router v6
- Emotion (for styling)
- LTHT React components
- Axios (for API requests)

## Development Mode

The application currently uses mock data for development purposes. In a production environment, these would be replaced with actual API calls.

To use mock data:
```
REACT_APP_USE_MOCK=true npm start
```

## Authentication

For testing, use the following credentials:
- Email: test@example.com
- Password: password

## License

This project is licensed under the MIT License.