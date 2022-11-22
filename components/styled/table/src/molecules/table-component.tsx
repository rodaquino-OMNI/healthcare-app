import { Icon } from '@ltht-react/icon'
import { TABLE_COLOURS } from '@ltht-react/styles'
import { flexRender, Header as ReactTableHeader, Table } from '@tanstack/react-table'
import { useEffect, useMemo, useRef } from 'react'
import { calculateStaticColumnOffset } from './table-methods'
import {
  StyledNextPageButtonContainer,
  StyledTable,
  StyledTableData,
  StyledTableHeader,
  StyledTHead,
} from './table-styled-components'
import useDimensionsRef from './useDimensionRef'

const TableComponent = <T,>({ table, staticColumns }: ITableHeadProps<T>): JSX.Element => {
  const firstColumn = useRef(null)
  const secondColumn = useRef(null)
  const { width: firstColumnWidth } = useDimensionsRef(firstColumn)
  const { width: secondColumnWidth } = useDimensionsRef(secondColumn)

  const usingExpanderColumn = table.getHeaderGroups().some((x) => x.headers.some((h) => h.column.id === 'expander'))
  const totalStaticColumns = useMemo(() => (usingExpanderColumn ? staticColumns + 1 : staticColumns), [
    usingExpanderColumn,
    staticColumns,
  ])

  useEffect(() => {
    window.dispatchEvent(new Event('updateDimensions'))
  }, [totalStaticColumns])

  const getHeaderColumn = <TData, TValue>(header: ReactTableHeader<TData, TValue>, headerIndex: number) => {
    switch (headerIndex) {
      case 0:
        return (
          <StyledTableHeader
            stickyWidth={calculateStaticColumnOffset(
              headerIndex,
              totalStaticColumns,
              firstColumnWidth,
              secondColumnWidth
            )}
            key={header.id}
            colSpan={header.colSpan}
            ref={firstColumn}
            role="columnheader"
            {...(header.column.id !== 'expander'
              ? {
                  style: {
                    cursor: header.column.getCanSort() ? 'pointer' : '',
                  },
                  onClick: header.column.getToggleSortingHandler(),
                }
              : {})}
          >
            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
          </StyledTableHeader>
        )
      case 1:
        return (
          <StyledTableHeader
            stickyWidth={calculateStaticColumnOffset(
              headerIndex,
              totalStaticColumns,
              firstColumnWidth,
              secondColumnWidth
            )}
            key={header.id}
            colSpan={header.colSpan}
            ref={secondColumn}
            role="columnheader"
            {...(header.column.id !== 'expander'
              ? {
                  style: {
                    cursor: header.column.getCanSort() ? 'pointer' : '',
                  },
                  onClick: header.column.getToggleSortingHandler(),
                }
              : {})}
          >
            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
          </StyledTableHeader>
        )

      default:
        return (
          <StyledTableHeader
            stickyWidth={calculateStaticColumnOffset(
              headerIndex,
              totalStaticColumns,
              firstColumnWidth,
              secondColumnWidth
            )}
            key={header.id}
            colSpan={header.colSpan}
            role="columnheader"
            {...(header.column.id !== 'expander'
              ? {
                  style: {
                    cursor: header.column.getCanSort() ? 'pointer' : '',
                  },
                  onClick: header.column.getToggleSortingHandler(),
                }
              : {})}
          >
            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
          </StyledTableHeader>
        )
    }
  }

  return (
    <StyledTable>
      <StyledTHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} role="row">
            {headerGroup.headers.map((header, headerIndex) => getHeaderColumn(header, headerIndex))}
          </tr>
        ))}
      </StyledTHead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} role="row">
            {row.getVisibleCells().map((cell, cellIdx) => (
              <StyledTableData
                stickyWidth={calculateStaticColumnOffset(
                  cellIdx,
                  totalStaticColumns,
                  firstColumnWidth,
                  secondColumnWidth
                )}
                key={cell.id}
                style={{
                  background: cellIdx % 2 === 1 ? TABLE_COLOURS.STRIPE_LIGHT : TABLE_COLOURS.STRIPE_DARK,
                  textAlign: 'center',
                }}
                role="cell"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </StyledTableData>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  )
}

const TableNavigationButton = ({ position, getCanNextPage, nextPage }: ITableNavButtonProps) => (
  <StyledNextPageButtonContainer
    role="button"
    elementPosition={position}
    onClick={() => nextPage()}
    hidden={!getCanNextPage()}
  >
    <Icon type="chevron" direction={position === 'bottom' ? 'down' : 'right'} size="medium" />
  </StyledNextPageButtonContainer>
)

interface ITableNavButtonProps {
  position: 'bottom' | 'right'
  getCanNextPage: () => boolean
  nextPage: () => void
}

interface ITableHeadProps<T> {
  table: Table<T>
  staticColumns: 0 | 1 | 2
}

export default TableComponent
export { TableNavigationButton }
