// This file provides mock implementations for LTHT React components
import React from 'react';

// Export basic components
export const Button = (props: any) => React.createElement('button', props);

export const Card = (props: any) => React.createElement('div', { ...props, className: `card ${props.className || ''}` });
Card.Body = (props: any) => React.createElement('div', { ...props, className: `card-body ${props.className || ''}` });
Card.Header = (props: any) => React.createElement('div', { ...props, className: `card-header ${props.className || ''}` });
Card.Footer = (props: any) => React.createElement('div', { ...props, className: `card-footer ${props.className || ''}` });

export const DescriptionList = (props: any) => React.createElement('dl', props);
DescriptionList.Item = (props: any) => {
  const { term, children, ...rest } = props;
  return React.createElement(
    'div', 
    { ...rest, className: 'description-list-item' },
    [
      React.createElement('dt', { key: 'term' }, term),
      React.createElement('dd', { key: 'description' }, children)
    ]
  );
};

export const Input = (props: any) => React.createElement('input', props);

export const Select = (props: any) => {
  const { options, ...rest } = props;
  return React.createElement(
    'select',
    rest,
    options ? options.map((option: any) => 
      React.createElement('option', { key: option.value, value: option.value }, option.label)
    ) : null
  );
};

export const Form = (props: any) => React.createElement('form', props);
Form.Group = (props: any) => React.createElement('div', { ...props, className: 'form-group' });
Form.Label = (props: any) => React.createElement('label', props);

export const List = (props: any) => React.createElement('ul', { ...props, className: `list ${props.className || ''}` });
List.Item = (props: any) => React.createElement('li', { ...props, className: `list-item ${props.className || ''}` });

export const PatientBanner = (props: any) => {
  const { patient, ...rest } = props;
  return React.createElement(
    'div',
    { ...rest, className: 'patient-banner' },
    [
      React.createElement('div', { key: 'name', className: 'patient-name' }, patient.fullName),
      React.createElement('div', { key: 'details', className: 'patient-details' }, 
        `${patient.gender || ''} ${patient.birthDate ? `DOB: ${patient.birthDate}` : ''}`
      )
    ]
  );
};

export const AllergyDetail = (props: any) => {
  const { allergy, ...rest } = props;
  return React.createElement(
    'div',
    { ...rest, className: 'allergy-detail' },
    [
      React.createElement('h4', { key: 'title' }, allergy.code?.text || 'Allergy'),
      React.createElement('div', { key: 'status' }, `Status: ${allergy.clinicalStatus?.coding?.[0]?.display || 'Unknown'}`),
      React.createElement('div', { key: 'severity' }, `Severity: ${allergy.reaction?.[0]?.severity || 'Unknown'}`)
    ]
  );
};

export const AllergyCard = (props: any) => {
  const { allergy, ...rest } = props;
  return React.createElement(
    'div',
    { ...rest, className: 'allergy-card' },
    allergy.code?.text || 'Allergy'
  );
};

export const FlagDetail = (props: any) => {
  const { flag, ...rest } = props;
  return React.createElement(
    'div',
    { ...rest, className: 'flag-detail' },
    [
      React.createElement('h4', { key: 'title' }, flag.code?.text || 'Flag'),
      React.createElement('div', { key: 'status' }, `Status: ${flag.status || 'Unknown'}`),
      React.createElement('div', { key: 'category' }, `Category: ${flag.category?.[0]?.coding?.[0]?.display || 'Unknown'}`)
    ]
  );
};

export const Table = (props: any) => React.createElement('table', { ...props, className: `table ${props.className || ''}` });

// Add Table subcomponents
Table.Header = (props: any) => React.createElement('thead', props);
Table.Body = (props: any) => React.createElement('tbody', props);
Table.Row = (props: any) => React.createElement('tr', props);
Table.Cell = (props: any) => React.createElement('td', props);
Table.Footer = (props: any) => React.createElement('tfoot', props);