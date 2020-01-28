/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'

import { TEXT_PRIMARY_COLOUR } from '@ltht-react/styles'
import { Flag } from '@ltht-react/types'
import { periodSummaryText } from '@ltht-react/utils'

const styles = css`
  color: ${TEXT_PRIMARY_COLOUR};
  text-align: right;
`

const FlagDate: React.FC<Props> = ({ flag }) => {
  return <div css={styles}>{periodSummaryText(flag.period)}</div>
}

interface Props {
  flag: Flag
}

export default FlagDate
