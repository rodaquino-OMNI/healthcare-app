import React from 'react';
import styled from '@emotion/styled';
import { announceToScreenReader } from '../../utils/accessibility';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  siblingCount?: number;
}

const PaginationContainer = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const PageInfo = styled.div`
  margin: 0 1rem;
  font-size: 0.875rem;
`;

const Button = styled.button<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 2rem;
  height: 2rem;
  margin: 0 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.isActive ? '#0d6efd' : '#dee2e6'};
  border-radius: 0.25rem;
  background-color: ${props => props.isActive ? '#0d6efd' : 'white'};
  color: ${props => props.isActive ? 'white' : '#212529'};
  cursor: ${props => props.isActive ? 'default' : 'pointer'};
  font-size: 0.875rem;
  line-height: 1;
  text-align: center;
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${props => props.isActive ? '#0d6efd' : '#e9ecef'};
  }

  &:focus {
    outline: 2px solid #2684FF;
    outline-offset: 2px;
    z-index: 1;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const Select = styled.select`
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  
  &:focus {
    outline: 2px solid #2684FF;
    outline-offset: 2px;
  }
`;

const DOTS = '...';

export const AccessiblePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  siblingCount = 1,
}) => {
  // Generate page numbers array with dots for pagination
  const generatePaginationRange = () => {
    const range = [];
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + first + current + last
    
    // Case 1: If total pages is less than total page numbers to display
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate left and right siblings
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Include dots if there's space between siblings and bounds
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Case 2: Show left dots, but not right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      
      return [...leftRange, DOTS, totalPages];
    }
    
    // Case 3: Show right dots, but not left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      
      return [1, DOTS, ...rightRange];
    }
    
    // Case 4: Show both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      
      return [1, DOTS, ...middleRange, DOTS, totalPages];
    }
    
    return [];
  };

  const paginationRange = generatePaginationRange();

  // Calculate range of items showing
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Handle page change with announcement
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    
    onPageChange(page);
    announceToScreenReader(`Page ${page} of ${totalPages}`);
  };

  // Handle page size change with announcement
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
      announceToScreenReader(`Showing ${newSize} items per page`);
    }
  };

  return (
    <PaginationContainer aria-label="Pagination navigation">
      <PageSizeSelector>
        <label htmlFor="page-size-select">Items per page:</label>
        <Select
          id="page-size-select"
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={!onPageSizeChange}
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </PageSizeSelector>

      <div>
        <PageInfo aria-live="polite">
          Showing {startItem}-{endItem} of {totalItems} items
        </PageInfo>
      </div>

      <PaginationControls>
        <Button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          &laquo;
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          &lsaquo;
        </Button>

        {paginationRange.map((pageNumber, i) => {
          if (pageNumber === DOTS) {
            return (
              <Button key={`dots-${i}`} disabled aria-hidden="true">
                {DOTS}
              </Button>
            );
          }

          return (
            <Button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber as number)}
              isActive={pageNumber === currentPage}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          &rsaquo;
        </Button>
        <Button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          &raquo;
        </Button>
      </PaginationControls>
    </PaginationContainer>
  );
};