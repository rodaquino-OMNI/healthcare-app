import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AccessibleDataTable } from './AccessibleDataTable';

expect.extend(toHaveNoViolations);

interface TestData {
  id: number;
  name: string;
  age: number;
  status: string;
}

const testData: TestData[] = [
  { id: 1, name: 'John Doe', age: 35, status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 42, status: 'Inactive' },
  { id: 3, name: 'Robert Johnson', age: 28, status: 'Active' },
];

const testColumns = [
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Age', accessor: 'age', sortable: true },
  { header: 'Status', accessor: 'status' },
];

describe('AccessibleDataTable', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <AccessibleDataTable<TestData>
        data={testData}
        columns={testColumns}
        keyField="id"
        ariaLabel="Test patients table"
        caption="Patient Information"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should display loading state correctly and accessibly', async () => {
    const { container } = render(
      <AccessibleDataTable<TestData>
        data={[]}
        columns={testColumns}
        keyField="id"
        loading={true}
        ariaLabel="Loading patients table"
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading data...');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should display empty state correctly and accessibly', async () => {
    const { container } = render(
      <AccessibleDataTable<TestData>
        data={[]}
        columns={testColumns}
        keyField="id"
        emptyMessage="No patients found"
        ariaLabel="Empty patients table"
      />
    );

    expect(screen.getByText('No patients found')).toBeInTheDocument();
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle sorting correctly and accessibly', async () => {
    const { container } = render(
      <AccessibleDataTable<TestData>
        data={testData}
        columns={testColumns}
        keyField="id"
        ariaLabel="Sortable patients table"
      />
    );

    // Find sortable column header
    const nameHeader = screen.getByText('Name');
    
    // Click to sort ascending
    fireEvent.click(nameHeader);
    
    // Verify it has correct aria attributes
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    
    // Click again to sort descending
    fireEvent.click(nameHeader);
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle row clicks correctly and accessibly', async () => {
    const handleRowClick = jest.fn();
    
    const { container } = render(
      <AccessibleDataTable<TestData>
        data={testData}
        columns={testColumns}
        keyField="id"
        onRowClick={handleRowClick}
        ariaLabel="Interactive patients table"
      />
    );

    // Find first row
    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toHaveAttribute('role', 'button');
    
    // Click the row
    fireEvent.click(firstRow!);
    expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
    
    // Test keyboard accessibility
    fireEvent.keyDown(firstRow!, { key: 'Enter' });
    expect(handleRowClick).toHaveBeenCalledTimes(2);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});