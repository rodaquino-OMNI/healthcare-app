/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { ICON_GREEN_COLOUR, ICON_RED_COLOUR, ICON_AMBER_COLOUR } from '@ltht-react/core'

const ExclamationIcon: React.FC<ExclamationIconProps> = ({ status, size }) => {
  const styles = css`
    ${status === 'green' && `color: ${ICON_GREEN_COLOUR};`}
    ${status === 'amber' && `color: ${ICON_AMBER_COLOUR};`}
    ${status === 'red' && `color: ${ICON_RED_COLOUR};`}
  `
  return <FontAwesomeIcon css={styles} icon={faExclamationTriangle} />
}

type ExclamationIconProps = {
  /** indicates the colour of the icon */
  status: 'red' | 'green' | 'amber'
  /** indicates the size of the icon */
  size: 'small' | 'medium' | 'large'
}

export { ExclamationIcon }
