# Patient Management Application

A modern React TypeScript application for managing patients, appointments, medications, and healthcare provider interactions.

## Features

- Patient management (view, add, and edit patient records)
- Appointment scheduling and management
- Medication tracking and prescription management
- Provider assignment and scheduling
- Dashboard with key metrics

## Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn
- An understanding of React, TypeScript, and the LTHT component library

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Building for Production

```
npm run build
```

## Component Library

This application uses a wrapper system for LTHT React components to resolve TypeScript issues. The wrapper system:

- Extends button variants to include 'success', 'danger', and 'link'
- Provides proper typing for component composition (Form.Group, List.Item, etc.)
- Handles required props like submitHandler and options

### Using LTHT Components

Always import components from the wrapper file instead of directly from LTHT packages:

```typescript
// DON'T use these direct imports:
import Button from '@ltht-react/button';
import Card from '@ltht-react/card';
import { Form } from '@ltht-react/form';

// DO use the wrapper components:
import { 
  Button, 
  Card, 
  Form 
} from '../utils/ltht-component-wrappers';
```

### Example Usage

Here are some examples of how to use the wrapper components:

```typescript
// Button with extended variants
<Button variant="success">Success Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="link">Link Button</Button>

// Form with component composition
<Form submitHandler={handleSubmit}>
  <Form.Group>
    <Form.Label htmlFor="name">Name</Form.Label>
    <Input id="name" name="name" value={name} onChange={handleInputChange} />
  </Form.Group>
</Form>

// Select with options
<Select 
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  value={selectedOption}
  onChange={handleSelectChange}
/>
```

For more detailed examples, refer to:
- `src/import-test.tsx` - Example usage of all wrapper components
- `src/docs/LTHT-TYPESCRIPT-FIX-GUIDE.md` - Comprehensive documentation

## Development Approach

### Component Structure

The application follows a modular component structure:

- **Pages** - Top-level route components (Dashboard, PatientList, etc.)
- **Components** - Reusable UI components (LoadingSpinner, ErrorMessage, etc.)
- **Services** - API integration and data handling
- **Contexts** - State management with React Context API
- **Utils** - Helper functions and utilities

### Styling

Styled components with Emotion are used for styling. Global theme variables are defined in `src/theme.ts`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.