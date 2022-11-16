import { TableData } from '@ltht-react/table'
import { AdminActionsForQuestionnaire } from '@ltht-react/table/lib/organisms/questionnaire-table-methods'

export const expectedResultOfMappingWithHeadersOnXAxis: TableData = {
  headers: [
    { id: 'date', type: 'accessor', cellProps: { text: 'Record Date' } },
    { id: 'adminactions', type: 'accessor', cellProps: { text: 'Actions' } },
    { id: '1', type: 'accessor', cellProps: { text: 'Score' }, subHeaders: [] },
    { id: '2', type: 'accessor', cellProps: { text: 'Intervention' }, subHeaders: [] },
    { id: '3', type: 'accessor', cellProps: { text: 'Partial Indication' }, subHeaders: [] },
    {
      id: '4',
      type: 'group',
      cellProps: { text: 'Standard Observations' },
      subHeaders: [
        {
          id: '4a',
          type: 'group',
          cellProps: { text: 'RR (breaths/min)' },
          subHeaders: [
            { id: '4aa', type: 'accessor', cellProps: { text: 'RR Part 1 (breaths/min)' }, subHeaders: [] },
            { id: '4ab', type: 'accessor', cellProps: { text: 'RR Part 2 (breaths/min)' }, subHeaders: [] },
          ],
        },
        { id: '4b', type: 'accessor', cellProps: { text: 'O2 Sat (%)' }, subHeaders: [] },
        { id: '4c', type: 'accessor', cellProps: { text: 'Supp O2' }, subHeaders: [] },
        { id: '4d', type: 'accessor', cellProps: { text: 'Blood Pressure' }, subHeaders: [] },
        { id: '4e', type: 'accessor', cellProps: { text: 'Standing 1 Minute BP' }, subHeaders: [] },
        { id: '4f', type: 'accessor', cellProps: { text: 'Standing 3 Minute BP' }, subHeaders: [] },
        { id: '4g', type: 'accessor', cellProps: { text: 'HR (BPM)' }, subHeaders: [] },
        { id: '4h', type: 'accessor', cellProps: { text: 'Temp (°C)' }, subHeaders: [] },
        { id: '4i', type: 'accessor', cellProps: { text: 'Consciousness' }, subHeaders: [] },
        { id: '4j', type: 'accessor', cellProps: { text: 'Pain Score' }, subHeaders: [] },
        { id: '4k', type: 'accessor', cellProps: { text: 'Blood Glucose (mmol/L)' }, subHeaders: [] },
      ],
    },
  ],
  rows: [
    {
      date: { text: '17-Feb-2022 17:23' },
      adminactions: {
        adminActions: [
          {
            text: 'View',
            clickHandler: () => {
              console.log('Viewing submission 1')
            },
            leftIcon: { type: 'info-circle', size: 'medium' },
            rightIcon: { type: 'external-link', size: 'medium' },
          },
        ],
      },
      '1': { text: '5 NEWS' },
      '2': { text: 'ICON' },
      '3': { text: 'No' },
      '4': { text: 'CHECKBOX' },
      '4a': { text: '25' },
      '4aa': { text: '25(1)' },
      '4ab': { text: '25(2)' },
      '4b': { text: '92 (Target 94-98 %)' },
      '4c': { text: '93' },
      '4d': { text: '144 / 122' },
      '4e': { text: '120' },
      '4f': { text: '143' },
      '4g': { text: '88' },
      '4h': { text: '37' },
      '4i': { text: 'Alert' },
      '4j': { text: '8' },
      '4k': { text: '75' },
    },
    {
      date: { text: '12-Feb-2022 12:33' },
      adminactions: {
        adminActions: [
          {
            text: 'View',
            clickHandler: () => {
              console.log('Viewing submission 2')
            },
            leftIcon: { type: 'info-circle', size: 'medium' },
            rightIcon: { type: 'external-link', size: 'medium' },
          },
        ],
      },
      '1': { text: '40 NEWS' },
      '2': { text: 'ICON' },
      '3': { text: 'Yes' },
      '4': { text: 'CHECKBOX' },
      '4a': { text: '31' },
      '4aa': { text: '31(1)' },
      '4ab': { text: '31(2)' },
      '4b': { text: '81 (Target 94-98 %)' },
      '4c': { text: '95' },
      '4d': { text: '160 / 140' },
      '4e': { text: '140' },
      '4f': { text: '132' },
      '4g': { text: '74' },
      '4h': { text: '64' },
      '4i': { text: 'Alert' },
      '4j': { text: '3' },
      '4k': { text: '65' },
    },
    {
      date: { text: '01-Jan-2022 16:02' },
      adminactions: {
        adminActions: [
          {
            text: 'View',
            clickHandler: () => {
              console.log('Viewing submission 3')
            },
            leftIcon: { type: 'info-circle', size: 'medium' },
            rightIcon: { type: 'external-link', size: 'medium' },
          },
        ],
      },
      '1': { text: '17 NEWS' },
      '2': { text: 'ICON' },
      '3': { text: 'No' },
      '4': { text: 'CHECKBOX' },
      '4a': { text: '17' },
      '4aa': { text: '17(1)' },
      '4ab': { text: '17(2)' },
      '4b': { text: '95 (Target 94-98 %)' },
      '4c': { text: '103' },
      '4d': { text: '125 / 115' },
      '4e': { text: '129' },
      '4f': { text: '123' },
      '4g': { text: '120' },
      '4h': { text: '23' },
      '4i': { text: 'Confusion' },
      '4j': { text: '5' },
      '4k': { text: '102' },
    },
  ],
}

export const expectedResultOfMappingWithHeadersOnYAxis: TableData = {
  headers: [
    { id: 'property', type: 'accessor', cellProps: { text: '' } },
    { id: '1', type: 'accessor', cellProps: { text: '17-Feb-2022 17:23' } },
    { id: '2', type: 'accessor', cellProps: { text: '12-Feb-2022 12:33' } },
    { id: '3', type: 'accessor', cellProps: { text: '01-Jan-2022 16:02' } },
  ],
  rows: [
    {
      property: { text: 'Actions' },
      '1': {
        adminActions: [
          {
            text: 'View',
            clickHandler: () => {
              console.log('Viewing submission 1')
            },
            leftIcon: { type: 'info-circle', size: 'medium' },
            rightIcon: { type: 'external-link', size: 'medium' },
          },
        ],
      },
      '2': {
        adminActions: [
          {
            text: 'View',
            clickHandler: () => {
              console.log('Viewing submission 2')
            },
            leftIcon: { type: 'info-circle', size: 'medium' },
            rightIcon: { type: 'external-link', size: 'medium' },
          },
        ],
      },
      '3': {
        adminActions: [
          {
            text: 'View',
            clickHandler: () => {
              console.log('Viewing submission 3')
            },
            leftIcon: { type: 'info-circle', size: 'medium' },
            rightIcon: { type: 'external-link', size: 'medium' },
          },
        ],
      },
    },
    {
      property: { text: 'Score' },
      '1': { text: '5 NEWS' },
      '2': { text: '40 NEWS' },
      '3': { text: '17 NEWS' },
    },
    {
      property: { text: 'Intervention' },
      '1': { text: 'ICON' },
      '2': { text: 'ICON' },
      '3': { text: 'ICON' },
    },
    {
      property: { text: 'Partial Indication' },
      '1': { text: 'No' },
      '2': { text: 'Yes' },
      '3': { text: 'No' },
    },
    {
      property: { text: 'Standard Observations' },
      '1': { iconProps: { type: 'checkbox', size: 'medium' } },
      '2': { iconProps: { type: 'checkbox', size: 'medium' } },
      '3': { iconProps: { type: 'checkbox', size: 'medium' } },
      subRows: [
        {
          property: { text: 'RR (breaths/min)' },
          '1': { text: '25' },
          '2': { text: '31' },
          '3': { text: '17' },
          subRows: [
            {
              property: { text: 'RR Part 1 (breaths/min)' },
              '1': { text: '25(1)' },
              '2': { text: '31(1)' },
              '3': { text: '17(1)' },
            },
            {
              property: { text: 'RR Part 2 (breaths/min)' },
              '1': { text: '25(2)' },
              '2': { text: '31(2)' },
              '3': { text: '17(2)' },
            },
          ],
        },
        {
          property: { text: 'O2 Sat (%)' },
          '1': { text: '92 (Target 94-98 %)' },
          '2': { text: '81 (Target 94-98 %)' },
          '3': { text: '95 (Target 94-98 %)' },
        },
        {
          property: { text: 'Supp O2' },
          '1': { text: '93' },
          '2': { text: '95' },
          '3': { text: '103' },
        },
        {
          property: { text: 'Blood Pressure' },
          '1': { text: '144 / 122' },
          '2': { text: '160 / 140' },
          '3': { text: '125 / 115' },
        },
        {
          property: { text: 'Standing 1 Minute BP' },
          '1': { text: '120' },
          '2': { text: '140' },
          '3': { text: '129' },
        },
        {
          property: { text: 'Standing 3 Minute BP' },
          '1': { text: '143' },
          '2': { text: '132' },
          '3': { text: '123' },
        },
        {
          property: { text: 'HR (BPM)' },
          '1': { text: '88' },
          '2': { text: '74' },
          '3': { text: '120' },
        },
        {
          property: { text: 'Temp (°C)' },
          '1': { text: '37' },
          '2': { text: '64' },
          '3': { text: '23' },
        },
        {
          property: { text: 'Consciousness' },
          '1': { text: 'Alert' },
          '2': { text: 'Alert' },
          '3': { text: 'Confusion' },
        },
        {
          property: { text: 'Pain Score' },
          '1': { text: '8' },
          '2': { text: '3' },
          '3': { text: '5' },
        },
        {
          property: { text: 'Blood Glucose (mmol/L)' },
          '1': { text: '75' },
          '2': { text: '65' },
          '3': { text: '102' },
        },
      ],
    },
  ],
}

export const mockAdminActionsForForms: AdminActionsForQuestionnaire[] = [
  {
    questionnaire: '1',
    adminActions: [
      {
        text: 'View',
        clickHandler: () => {
          console.log('Viewing submission 1')
        },
        leftIcon: { type: 'info-circle', size: 'medium' },
        rightIcon: { type: 'external-link', size: 'medium' },
      },
    ],
  },
  {
    questionnaire: '2',
    adminActions: [
      {
        text: 'View',
        clickHandler: () => {
          console.log('Viewing submission 2')
        },
        leftIcon: { type: 'info-circle', size: 'medium' },
        rightIcon: { type: 'external-link', size: 'medium' },
      },
    ],
  },
  {
    questionnaire: '3',
    adminActions: [
      {
        text: 'View',
        clickHandler: () => {
          console.log('Viewing submission 3')
        },
        leftIcon: { type: 'info-circle', size: 'medium' },
        rightIcon: { type: 'external-link', size: 'medium' },
      },
    ],
  },
]
