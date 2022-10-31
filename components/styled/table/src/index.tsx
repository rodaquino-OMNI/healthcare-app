import { FC } from 'react'
import { Questionnaire, QuestionnaireItem, QuestionnaireResponse, SummaryTableViewType } from '@ltht-react/types'
import { EnsureMaybe, EnsureMaybeArray } from '@ltht-react/utils'
import QuestionnaireTable from './molecules/questionnaire-table'
import GenericTableMolecule from './molecules/generic-table'
import { TableData } from './atoms/table'

const Table: FC<IProps> = ({ definition, records, orientation = 'VERTICAL' }) => {
  if (!definition.item || definition.item.length === 0) {
    return <div>Could not render table. Definition items array was empty.</div>
  }

  return (
    <QuestionnaireTable
      definitionItems={EnsureMaybeArray<QuestionnaireItem>(definition.item)}
      records={records}
      orientation={orientation}
    />
  )
}

export const GenericTable = <TColumn, TRow>({
  columnData,
  rowData,
  orientation = 'VERTICAL',
  mapToTableData,
}: IGenericTableProps<TColumn, TRow>) => (
  <GenericTableMolecule
    columnData={EnsureMaybe<TColumn>(columnData)}
    rowData={EnsureMaybe<TRow>(rowData)}
    mapToTableData={mapToTableData}
    orientation={orientation}
  />
)

interface IProps {
  orientation?: SummaryTableViewType
  definition: Questionnaire
  records: QuestionnaireResponse[]
}

interface IGenericTableProps<TColumn, TRow> {
  orientation?: SummaryTableViewType
  columnData: TColumn
  rowData: TRow
  mapToTableData: (colData: TColumn, rowData: TRow) => TableData
}

export default Table
