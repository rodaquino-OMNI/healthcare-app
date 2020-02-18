/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'
import { TEXT_PRIMARY_COLOUR } from '@ltht-react/styles'

const styles = css`
  color: ${TEXT_PRIMARY_COLOUR};
  margin-top: 0.25rem;
`

const DescriptionListDescription: React.FC = ({ children }) => {
  return <dd css={styles}>{children}</dd>
}

export default DescriptionListDescription
