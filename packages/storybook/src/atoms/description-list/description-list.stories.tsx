import React from 'react'
import { storiesOf } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'

import dlreadme from '@ltht-react/description-list/README.md'
import { DescriptionList, DescriptionListTerm, DescriptionListDescription } from '@ltht-react/description-list'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stories = storiesOf('Atoms|Description List', module) as any

stories.addWithJSX = JSXAddon.addWithJSX

stories.addParameters({
  readme: {
    sidebar: dlreadme,
  },
})

stories.addWithJSX('Description List', () => (
  <DescriptionList>
    <DescriptionListTerm>Term</DescriptionListTerm>
    <DescriptionListDescription>Description</DescriptionListDescription>
  </DescriptionList>
))
