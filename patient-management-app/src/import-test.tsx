import React from 'react';

// Access React APIs via namespace
const { FormEvent, useState } = React;

import {
  Button,
  Card,
  DescriptionList,
  Form,
  Input,
  List,
  PatientBanner,
  Select,
  Table,
  AllergyDetail,
  AllergyCard,
  FlagDetail
} from './utils/ltht-component-wrappers';

/**
 * This file demonstrates the correct usage of all LTHT wrapper components
 * It serves as a reference for implementing these components elsewhere
 */
const ImportTestComponent: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    status: 'active',
    medication: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with:', formState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Sample allergy data
  const allergyData = {
    id: 'allergy-001',
    clinicalStatus: {
      coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active', display: 'Active' }]
    },
    type: 'allergy',
    category: ['medication'],
    criticality: 'high',
    code: {
      coding: [{ system: 'http://snomed.info/sct', code: '372687004', display: 'Penicillin' }],
      text: 'Penicillin'
    },
    patient: { reference: 'Patient/patient-001' },
    onsetDateTime: '2018-04-05',
    reaction: [{
      manifestation: [{
        coding: [{ system: 'http://snomed.info/sct', code: '247472004', display: 'Hives' }],
        text: 'Hives'
      }],
      severity: 'severe'
    }]
  };

  // Sample flag data
  const flagData = {
    id: 'flag-001',
    status: 'active',
    category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/flag-category', code: 'clinical', display: 'Clinical' }] }],
    code: {
      coding: [{ system: 'http://snomed.info/sct', code: '390952000', display: 'Diabetes Mellitus Type 2' }],
      text: 'Diabetes Mellitus Type 2'
    },
    subject: { reference: 'Patient/patient-001' },
    period: { start: '2020-01-01' }
  };

  // List of medications for the select component
  const medications = [
    { value: 'med1', label: 'Lisinopril 10mg' },
    { value: 'med2', label: 'Atorvastatin 20mg' },
    { value: 'med3', label: 'Metformin 500mg' }
  ];

  // Status options for another select example
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>LTHT React Component Wrapper Examples</h1>
      
      {/* PatientBanner Example */}
      <section>
        <h2>PatientBanner Component</h2>
        <PatientBanner 
          patient={{
            fullName: 'John Smith',
            gender: 'male',
            nhsNumber: '9000000001',
            dateOfBirth: new Date('1980-01-15'),
            gpDetails: { name: 'Dr. Jane Doe' }
          }}
        />
      </section>

      {/* Button Examples */}
      <section>
        <h2>Button Component with Extended Variants</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Card Example */}
      <section>
        <h2>Card Component with Body</h2>
        <Card>
          <Card.Body>
            <p>This is content inside a Card.Body component.</p>
          </Card.Body>
        </Card>
      </section>

      {/* DescriptionList Example */}
      <section>
        <h2>DescriptionList Component</h2>
        <Card>
          <Card.Body>
            <DescriptionList>
              <DescriptionList.Item term="Name">John Smith</DescriptionList.Item>
              <DescriptionList.Item term="NHS Number">9000000001</DescriptionList.Item>
              <DescriptionList.Item term="Date of Birth">15 Jan 1980</DescriptionList.Item>
              <DescriptionList.Item term="Address">123 Main St, London, W1 1AA</DescriptionList.Item>
            </DescriptionList>
          </Card.Body>
        </Card>
      </section>

      {/* List Example */}
      <section>
        <h2>List Component</h2>
        <Card>
          <Card.Body>
            <List>
              <List.Item>First item in the list</List.Item>
              <List.Item>Second item in the list</List.Item>
              <List.Item>Third item in the list</List.Item>
            </List>
          </Card.Body>
        </Card>
      </section>

      {/* Form Example */}
      <section>
        <h2>Form Component with Group and Label</h2>
        <Card>
          <Card.Body>
            <Form submitHandler={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor="name">Name</Form.Label>
                <Input 
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="status">Status</Form.Label>
                <Select
                  id="status"
                  name="status"
                  value={formState.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="medication">Medication</Form.Label>
                <Select
                  id="medication"
                  name="medication"
                  value={formState.medication}
                  onChange={handleInputChange}
                >
                  <option value="">Select a medication</option>
                  <option value="med1">Lisinopril 10mg</option>
                  <option value="med2">Atorvastatin 20mg</option>
                  <option value="med3">Metformin 500mg</option>
                </Select>
              </Form.Group>

              <Button type="submit" variant="primary" style={{ marginTop: '20px' }}>
                Submit Form
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </section>

      {/* AllergyDetail Example */}
      <section>
        <h2>AllergyDetail Component</h2>
        <Card>
          <Card.Body>
            <AllergyDetail allergy={allergyData} />
          </Card.Body>
        </Card>
      </section>

      {/* AllergyCard Example */}
      <section>
        <h2>AllergyCard Component</h2>
        <AllergyCard allergy={allergyData} />
      </section>

      {/* FlagDetail Example */}
      <section>
        <h2>FlagDetail Component</h2>
        <Card>
          <Card.Body>
            <FlagDetail flag={flagData} />
          </Card.Body>
        </Card>
      </section>

      {/* Table Example */}
      <section>
        <h2>Table Component</h2>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Status</Table.Cell>
              <Table.Cell>Date</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>John Smith</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>2025-07-15</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Emma Jones</Table.Cell>
              <Table.Cell>Completed</Table.Cell>
              <Table.Cell>2025-07-12</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </section>
    </div>
  );
};

export default ImportTestComponent;