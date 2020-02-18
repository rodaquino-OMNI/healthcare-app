import React from 'react'
import { storiesOf } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'

import readme from '@ltht-react/detail/README.md'
import { NarrativeDetail } from '@ltht-react/detail'
import * as fixtures from './detail.fixtures'

const stories = storiesOf('Molecules|Detail', module)

stories.addWithJSX = JSXAddon.addWithJSX

stories.addParameters({
  readme: {
    sidebar: readme,
  },
})

stories.addWithJSX('Narrative', () => <NarrativeDetail narrative={fixtures.narrative} />)
