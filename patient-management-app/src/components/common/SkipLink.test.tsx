import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SkipLink } from './SkipLink';

expect.extend(toHaveNoViolations);

describe('SkipLink', () => {
  it('should render with default text', () => {
    render(<SkipLink targetId="main" />);
    const link = screen.getByTestId('skip-link');
    expect(link).toHaveTextContent('Skip to main content');
    expect(link).toHaveAttribute('href', '#main');
  });

  it('should render with custom text', () => {
    render(<SkipLink targetId="content" text="Skip to content" />);
    const link = screen.getByTestId('skip-link');
    expect(link).toHaveTextContent('Skip to content');
    expect(link).toHaveAttribute('href', '#content');
  });

  it('should apply custom class name', () => {
    render(<SkipLink targetId="main" className="custom-skip" />);
    const link = screen.getByTestId('skip-link');
    expect(link).toHaveClass('custom-skip');
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(<SkipLink targetId="main" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});