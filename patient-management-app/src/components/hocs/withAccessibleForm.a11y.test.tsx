import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { withAccessibleForm } from './withAccessibleForm';

expect.extend(toHaveNoViolations);

interface DummyFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  error?: string;
}

const DummyForm: React.FC<DummyFormProps> = ({ onSubmit, isSubmitting }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit({ test: 'data' });
  }}>
    <label htmlFor="test-input">Test Input</label>
    <input id="test-input" type="text" aria-required="true" />
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
);

const AccessibleForm = withAccessibleForm(DummyForm);

describe('Accessible Form', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <AccessibleForm onSubmit={() => {}} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle loading state correctly', async () => {
    const { container } = render(
      <AccessibleForm onSubmit={() => {}} isSubmitting={true} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle error state correctly', async () => {
    const { container } = render(
      <AccessibleForm onSubmit={() => {}} error="Test error message" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});