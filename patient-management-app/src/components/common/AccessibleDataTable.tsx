import React from 'react';
import { announceToScreenReader } from '../../utils/accessibility';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (data: T) => void;
  ariaLabel: string;
  caption?: string;
}

export function AccessibleDataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  emptyMessage = "No data available",
  loading = false,
  onRowClick,
  ariaLabel,
  caption,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || typeof column.accessor !== 'string') return;
    
    const newDirection = sortConfig.key === column.accessor && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    setSortConfig({
      key: column.accessor,
      direction: newDirection,
    });
    
    announceToScreenReader(`Table sorted by ${column.header} in ${newDirection === 'asc' ? 'ascending' : 'descending'} order`);
  };

  // Sort the data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    const sortableData = [...data];
    sortableData.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : comparison * -1;
    });
    
    return sortableData;
  }, [data, sortConfig]);

  // Announce loading state to screen readers
  React.useEffect(() => {
    if (loading) {
      announceToScreenReader('Loading data');
    } else {
      announceToScreenReader(`Data loaded, ${data.length} items available`);
    }
  }, [loading, data]);

  return (
    <div className="table-responsive" role="region" aria-label={ariaLabel}>
      <table aria-busy={loading}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                scope="col"
                aria-sort={sortConfig.key === column.accessor 
                  ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') 
                  : undefined
                }
                className={column.sortable ? 'sortable' : undefined}
                onClick={() => column.sortable && handleSort(column)}
                tabIndex={column.sortable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSort(column);
                  }
                }}
              >
                {column.header}
                {column.sortable && (
                  <span className="sort-icon" aria-hidden="true">
                    {sortConfig.key === column.accessor
                      ? sortConfig.direction === 'asc'
                        ? ' ↑'
                        : ' ↓'
                      : ' ↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="loading-cell">
                <div role="status">Loading data...</div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr 
                key={String(row[keyField])}
                onClick={() => onRowClick && onRowClick(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
                className={onRowClick ? 'clickable-row' : undefined}
                role={onRowClick ? 'button' : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
