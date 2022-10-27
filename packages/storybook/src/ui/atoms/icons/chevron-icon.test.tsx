import { render, screen } from '@testing-library/react'

import { ChevronIcon } from '@ltht-react/icon'
import styled from '@emotion/styled'

describe('Chevron Icon', () => {
  it('Renders', () => {
    render(<ChevronIcon direction="up" size="medium" />)
  })

  it('Has the right class name', () => {
    render(<ChevronIcon direction="up" size="small" />)

    expect(screen.getByRole('img', { hidden: true })).toHaveClass('icon__chevron')
  })

  it('Can be styled', () => {
    const StyledIcon = styled(ChevronIcon)`
      color: pink;
    `

    render(<StyledIcon direction="up" size="small" data-testid="123abc" />)

    expect(screen.getByTestId('123abc')).toHaveStyle({ color: 'pink' })
  })

  it('Can be given html attributes', () => {
    render(<ChevronIcon direction="up" size="small" data-testid="123abc" title="some-title" />)

    expect(screen.getByTestId('123abc')).toHaveAttribute('title', 'some-title')
  })
})
