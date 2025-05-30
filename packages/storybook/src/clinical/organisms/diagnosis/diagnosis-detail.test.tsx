import { render, screen } from '@testing-library/react'
import { PartialDateTimeKindCode } from '@ltht-react/types'
import DiagnosisDetail from '@ltht-react/diagnosis-detail'
import SNIPPET_HOVER_TEXT from '@ltht-react/diagnosis-detail/lib/constants'
import { conditions, NestedGroupWithDisplayExampleData } from './diagnosis.fixtures'

describe('Diagnosis Detail', () => {
  it('Renders', () => {
    render(<DiagnosisDetail condition={conditions[0]} />)

    expect(screen.getByText('Heel Pain')).toBeVisible()
  })

  it('Does not render diagnosis snippet when no matching system found', () => {
    const levelOneData = {
      ...conditions[0],
      metadata: {
        dataSources: [],
        isRedacted: false,
        requestedWhen: '',
        tag: [
          {
            display: 'Confirmed, Heel Pain: Adenocarcinoma, no subtype, Active',
          },
        ],
      },
    }

    render(<DiagnosisDetail condition={levelOneData} />)

    expect(screen.queryByText('Diagnosis Summary')).toBeNull()
    expect(screen.queryByText('Confirmed, Heel Pain: Adenocarcinoma, no subtype, Active')).toBeNull()
  })

  it('Does not render diagnosis snippet when system is matched but display is not present', () => {
    const levelOneData = {
      ...conditions[0],
      metadata: {
        dataSources: [],
        isRedacted: false,
        requestedWhen: '',
        tag: [
          {
            system: SNIPPET_HOVER_TEXT,
          },
        ],
      },
    }

    render(<DiagnosisDetail condition={levelOneData} />)

    expect(screen.queryByText('Diagnosis Summary')).toBeNull()
  })

  it('Does not render diagnosis snippet when system is matched but display is empty', () => {
    const levelOneData = {
      ...conditions[0],
      metadata: {
        dataSources: [],
        isRedacted: false,
        requestedWhen: '',
        tag: [
          {
            display: '',
            system: SNIPPET_HOVER_TEXT,
          },
        ],
      },
    }

    render(<DiagnosisDetail condition={levelOneData} />)

    expect(screen.queryByText('Diagnosis Summary')).toBeNull()
  })

  it('Does not render diagnosis snippet when no tag is found', () => {
    const levelOneData = {
      ...conditions[0],
      metadata: {
        dataSources: [],
        isRedacted: false,
        requestedWhen: '',
        tag: [],
      },
    }

    render(<DiagnosisDetail condition={levelOneData} />)

    expect(screen.queryByText('Diagnosis Summary')).toBeNull()
  })

  it('Renders all necessary data', () => {
    const levelOneData = {
      ...conditions[0],
      onset: {
        dateTime: {
          value: '2016-09-01T03:55:00+00:00',
          kind: PartialDateTimeKindCode.YearMonth,
        },
      },
      extensionData: [],
      note: [
        {
          text: 'some notes',
        },
      ],
    }

    render(<DiagnosisDetail condition={levelOneData} />)

    expect(screen.getByText('Diagnosis / Condition')).toBeVisible()
    expect(screen.getByText('Heel Pain')).toBeVisible()

    expect(screen.getByText('Diagnosis Summary')).toBeVisible()
    expect(screen.getByText('Confirmed, Heel Pain: Adenocarcinoma, no subtype, Active')).toBeVisible()

    expect(screen.getByText('Onset Date (Symptoms)')).toBeVisible()
    expect(screen.getByText('Sept-2016')).toBeVisible()

    expect(screen.getByText('Clinical Status')).toBeVisible()
    expect(screen.getByText('Active')).toBeVisible()

    expect(screen.getByText('Verification Status')).toBeVisible()
    expect(screen.getByText('Confirmed')).toBeVisible()

    expect(screen.getByText('Severity')).toBeVisible()
    expect(screen.getByText('Moderate')).toBeVisible()

    expect(screen.getByText('Diagnosis Stated By')).toBeVisible()
    expect(screen.getByText('BROWN, David (Dr)')).toBeVisible()

    expect(screen.getByText('Relationship')).toBeVisible()
    expect(screen.getByText('Practitioner')).toBeVisible()

    expect(screen.getByText('Diagnosis Date')).toBeVisible()
    expect(screen.getByText('07-Aug-2018')).toBeVisible()

    expect(screen.getByText('Note(s)')).toBeVisible()
    expect(screen.getByText('some notes')).toBeVisible()
  })

  it('Renders diagnosis title as a link element with link icon', () => {
    const levelOneData = {
      ...conditions[0],
      onset: {
        dateTime: {
          value: '2016-09-01T03:55:00+00:00',
          kind: PartialDateTimeKindCode.YearMonth,
        },
      },
      extensionData: [],
      note: [
        {
          text: 'some notes',
        },
      ],
    }
    const CODABLE_CONCEPT_LINK_MAP = {
      'Heel Pain': 'https://www.google.com',
    }

    render(<DiagnosisDetail condition={levelOneData} links={CODABLE_CONCEPT_LINK_MAP} />)

    expect(screen.getByText('Diagnosis / Condition')).toBeVisible()
    expect(screen.getByText('Heel Pain').closest('a')).toHaveAttribute('href', 'https://www.google.com')
    expect(screen.getByText('Heel Pain').closest('a')?.children[1]).toHaveClass('icon__external-link')
  })

  it('Renders questionnaire data for level 2 details', () => {
    const levelOneData = {
      ...conditions[0],
      extensionData: [NestedGroupWithDisplayExampleData],
    }

    render(<DiagnosisDetail condition={levelOneData} />)

    expect(screen.getAllByText('Trust Actions').length).toBe(3)
    expect(screen.getByText('Trust Action 1')).toBeVisible()
    expect(screen.getByText('Trust Action 2')).toBeVisible()

    expect(screen.getAllByText('Action Organised?').length).toBe(2)
    expect(screen.getByText('No')).toBeVisible()
    expect(screen.getByText('Yes')).toBeVisible()

    expect(screen.getByText('GP Actions')).toBeVisible()
    expect(screen.getByText('No actions for the GP post-discharge')).toBeVisible()
    expect(screen.getByText('No actions for the GP post-discharge')?.firstChild).toHaveClass('fa-circle-info')

    expect(screen.getAllByText('Community Pharmacy Actions').length).toBe(2)
    expect(screen.getByText('Community Pharmacy Action 1')).toBeVisible()

    expect(screen.getByText('Requested By?')).toBeVisible()
    expect(screen.getByText('Phil')).toBeVisible()

    expect(screen.getByText('CCG Actions')).toBeVisible()
    expect(screen.getByText('No actions for the CCG post-discharge')).toBeVisible()
    expect(screen.getByText('No actions for the CCG post-discharge')?.firstChild).toHaveClass('fa-circle-info')

    expect(screen.getByRole('mark')).toBeVisible()
    expect(screen.getByRole('mark').textContent).toBe(
      'Authored By: SMITH, Bob (Dr) Doctor - specialtyCodeName on 14-Oct-2021 13:17'
    )
  })
})
