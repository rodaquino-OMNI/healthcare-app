const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const helmet = require('helmet');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'test-environment-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());

// Mock data
const users = [
  {
    id: 'user-001',
    name: 'Test Doctor',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor'
  },
  {
    id: 'user-002',
    name: 'Test Nurse',
    email: 'nurse@example.com',
    password: 'password123',
    role: 'nurse'
  },
  {
    id: 'user-003',
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  }
];

const patients = [
  {
    id: 'patient-001',
    identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000001' }],
    name: [
      {
        family: 'Smith',
        given: ['John', 'William'],
        use: 'official',
      },
    ],
    gender: 'male',
    birthDate: '1980-01-15',
    address: [
      {
        line: ['123 Main St'],
        city: 'London',
        postalCode: 'W1 1AA',
      },
    ],
    telecom: [
      {
        system: 'phone',
        value: '07700 900123',
        use: 'mobile',
      },
      {
        system: 'email',
        value: 'john.smith@example.com',
      },
    ],
    flags: [
      {
        id: 'flag-001',
        status: 'active',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/flag-category',
                code: 'clinical',
                display: 'Clinical',
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '390952000',
              display: 'Diabetes Mellitus Type 2',
            },
          ],
          text: 'Diabetes Mellitus Type 2',
        },
        period: {
          start: '2020-01-01',
        },
      },
    ],
    allergies: [
      {
        id: 'allergy-001',
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
              display: 'Active',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        criticality: 'high',
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '372687004',
              display: 'Penicillin',
            },
          ],
          text: 'Penicillin',
        },
        onsetDateTime: '2018-04-05',
        reaction: [
          {
            manifestation: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '247472004',
                    display: 'Hives',
                  },
                ],
                text: 'Hives',
              },
            ],
            severity: 'severe',
          },
        ],
      },
    ],
    appointments: [
      {
        id: 'appointment-001',
        status: 'booked',
        start: '2023-11-15T09:00:00Z',
        end: '2023-11-15T09:30:00Z',
        description: 'Regular check-up',
        participant: [
          {
            actor: {
              reference: 'Practitioner/doctor-001',
              display: 'Dr. Jane Wilson'
            },
            status: 'accepted'
          }
        ]
      }
    ],
    medications: [
      {
        id: 'medication-001',
        status: 'active',
        medicationCodeableConcept: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '108979001',
              display: 'Metformin'
            }
          ],
          text: 'Metformin 500mg tablet'
        },
        dosageInstruction: [
          {
            text: 'Take one tablet twice daily with meals',
            timing: {
              repeat: {
                frequency: 2,
                period: 1,
                periodUnit: 'd'
              }
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 500,
                  unit: 'mg',
                  system: 'http://unitsofmeasure.org',
                  code: 'mg'
                }
              }
            ]
          }
        ],
        authoredOn: '2023-01-10',
        requester: {
          reference: 'Practitioner/doctor-001',
          display: 'Dr. Jane Wilson'
        }
      }
    ]
  },
  {
    id: 'patient-002',
    identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000002' }],
    name: [
      {
        family: 'Jones',
        given: ['Emma'],
        use: 'official',
      },
    ],
    gender: 'female',
    birthDate: '1975-06-20',
    address: [
      {
        line: ['456 High Street'],
        city: 'Manchester',
        postalCode: 'M1 1BB',
      },
    ],
    telecom: [
      {
        system: 'phone',
        value: '07700 900456',
        use: 'mobile',
      }
    ],
    flags: [],
    allergies: [],
    appointments: [],
    medications: []
  },
  {
    id: 'patient-003',
    identifier: [{ system: 'https://fhir.nhs.uk/Id/nhs-number', value: '9000000003' }],
    name: [
      {
        family: 'Taylor',
        given: ['Robert'],
        use: 'official',
      },
    ],
    gender: 'male',
    birthDate: '1990-11-05',
    address: [
      {
        line: ['789 Park Lane'],
        city: 'Birmingham',
        postalCode: 'B1 1CC',
      },
    ],
    telecom: [
      {
        system: 'phone',
        value: '07700 900789',
        use: 'mobile',
      }
    ],
    flags: [],
    allergies: [],
    appointments: [],
    medications: []
  }
];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// ROUTES

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', environment: 'testing' });
});

// Auth endpoints
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.email === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create tokens
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token,
    refreshToken
  });
});

app.post('/auth/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

app.get('/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Patient endpoints
app.get('/patients', authenticateToken, (req, res) => {
  // Implement simple search if search parameter exists
  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    const filteredPatients = patients.filter(patient => {
      const familyName = patient.name[0]?.family?.toLowerCase() || '';
      const givenNames = patient.name[0]?.given?.join(' ').toLowerCase() || '';
      const nhsNumber = patient.identifier[0]?.value || '';
      
      return familyName.includes(searchLower) || 
             givenNames.includes(searchLower) ||
             nhsNumber.includes(req.query.search);
    });
    
    return res.json({ patients: filteredPatients });
  }
  
  res.json({ patients });
});

app.get('/patients/:id', authenticateToken, (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  res.json({ patient });
});

// Appointments endpoints
app.get('/patients/:id/appointments', authenticateToken, (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  res.json({ appointments: patient.appointments || [] });
});

// Medications endpoints
app.get('/patients/:id/medications', authenticateToken, (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  res.json({ medications: patient.medications || [] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
  console.log(`Environment: testing`);
});

module.exports = app;