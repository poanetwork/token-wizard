import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow, mount } from 'enzyme'
import { CrowdsaleProgress } from '../../../src/components/Crowdsale/CrowdsaleProgress'

configure({ adapter: new Adapter() })

describe(`CrowdsaleProgress`, () => {
  const crowdsaleProgressData = {
    ethGoal: '0.001',
    tokensClaimedRatio: 50,
    totalRaisedFunds: '0.0005'
  }
  const wrapper = mount(
    <CrowdsaleProgress
      ethGoal={crowdsaleProgressData.ethGoal}
      tokensClaimedRatio={crowdsaleProgressData.tokensClaimedRatio}
      totalRaisedFunds={crowdsaleProgressData.totalRaisedFunds}
    />
  )

  it(`should contain a Total Raised Funds and a Goal`, () => {
    const total = wrapper.find('.cs-CrowdsaleProgress_FundsAmount-total-raised')
    const goal = wrapper.find('.cs-CrowdsaleProgress_FundsAmount-goal')

    expect(total.exists()).toBeTruthy()
    expect(goal.exists()).toBeTruthy()
  })

  it(`should contain a Progress bar with a set width`, () => {
    const progressBar = wrapper.find('.cs-CrowdsaleProgress_BarWidth')
    const progressBarStyleWidth = parseInt(progressBar.get(0).props.style['width'], 10)

    expect(progressBarStyleWidth === crowdsaleProgressData.tokensClaimedRatio).toBeTruthy()
  })

  it(`should render CrowdsaleProgress component`, () => {
    // Given
    const component = render.create(<CrowdsaleProgress />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
