import React from 'react'
import { storiesOf } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'

import { Widget, WidgetHeader, WidgetBody, WidgetFooter, WidgetList, WidgetListItem } from '@ltht-react/widget'
import readme from '@ltht-react/widget/README.md'

const stories = storiesOf('Components|Widget|Examples', module)

stories.addWithJSX = JSXAddon.addWithJSX

stories.addParameters({
  readme: {
    sidebar: readme,
  },
})

stories.addWithJSX('Basic', () => (
  <Widget>
    <WidgetHeader>
      <h3>Header</h3>
    </WidgetHeader>
    <WidgetBody>Body</WidgetBody>
  </Widget>
))

stories.addWithJSX('Footer', () => (
  <Widget>
    <WidgetHeader>
      <h3>Header</h3>
    </WidgetHeader>
    <WidgetBody>Body</WidgetBody>
    <WidgetFooter>Footer</WidgetFooter>
  </Widget>
))

stories.addWithJSX('List', () => (
  <div>
    <Widget>
      <WidgetHeader>
        <h3>Header</h3>
      </WidgetHeader>
      <WidgetList>
        <WidgetListItem>Item 1</WidgetListItem>
        <WidgetListItem>Item 2</WidgetListItem>
      </WidgetList>
      <WidgetFooter>Footer</WidgetFooter>
    </Widget>
  </div>
))

stories.addWithJSX('List (Clickable)', () => (
  <div>
    <Widget>
      <WidgetHeader>
        <h3>Header</h3>
      </WidgetHeader>
      <WidgetList clickable>
        <WidgetListItem>Item 1</WidgetListItem>
        <WidgetListItem>Item 2</WidgetListItem>
      </WidgetList>
      <WidgetFooter>Footer</WidgetFooter>
    </Widget>
  </div>
))
