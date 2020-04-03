/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'

import { DocumentReference } from '@ltht-react/types'
import { CARD_BORDER_COLOUR, TEXT_COLOURS, CARD_LIST_ITEM_BACKGROUND_HOVER } from '@ltht-react/styles'
import { UnorderedList, ListItem } from '@ltht-react/list'
import DocumentSummaryItem from './document-summary-item'
import DocumentSummaryContent from './document-summary-content'

const styles = {
  root: css`
    margin-right: -0.5rem;
    > ul li:first-of-type {
      font-weight: bold;
    }
    > ul li:not(:first-of-type) {
      border-top: 1px solid ${CARD_BORDER_COLOUR};
      padding-top: 0.25rem;
      &:hover {
        cursor: pointer;
        background: ${CARD_LIST_ITEM_BACKGROUND_HOVER};
      }
    }
    > ul li > div {
      align-items: center;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      padding-bottom: 0.25rem;
      padding-right: 0.5rem;
      > div {
        flex: auto;
        padding-left: 1rem;
      }
      > div:first-of-type {
        flex: 0 0 6rem;
        padding-left: 0;
      }
      > div.source {
        flex: 0 0 15rem;
        > div:last-of-type {
          color: ${TEXT_COLOURS.SECONDARY.VALUE};
          font-weight: normal;
        }
      }
      > div:last-of-type {
        flex: 0 0 2.25rem;
      }
    }
  `,
}

const DocumentSummary: React.FC<Props> = ({ documents = undefined, clickHandler = undefined }) => {
  if (!documents) {
    return null
  }

  const items = documents.map(x => <DocumentSummaryItem document={x} clickHandler={clickHandler} />)

  return (
    <div css={styles.root}>
      <UnorderedList>
        <ListItem key="0">
          <DocumentSummaryContent created="Created" description="Description" source="Source" status="Status" />
        </ListItem>
        {items}
      </UnorderedList>
    </div>
  )
}

interface Props {
  documents: DocumentReference[] | undefined
  clickHandler?(document: DocumentReference): void
}

export default DocumentSummary
