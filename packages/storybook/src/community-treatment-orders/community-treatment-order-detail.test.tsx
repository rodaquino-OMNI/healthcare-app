import React from 'react'
import { mount } from 'enzyme'
import ReactDOM from 'react-dom'

import CommunityTreatmentOrderDetail from '@ltht-react/community-treatment-order-detail'
import { CommunityTreatmentOrderOne } from './community-treatment-order.fixtures'

describe('CommunityTreatmentOrderSummary', () => {
  const communityTreatmentOrder = CommunityTreatmentOrderOne
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
      <CommunityTreatmentOrderDetail
        title="Community Treatment Order"
        communityTreatmentOrder={communityTreatmentOrder}
      />,
      div
    )
  })
  it('matches snapshot', () => {
    expect(
      mount(
        <CommunityTreatmentOrderDetail
          title="Community Treatment Order"
          communityTreatmentOrder={communityTreatmentOrder}
        />
      )
    ).toMatchSnapshot('wrapper mount')
  })
})
