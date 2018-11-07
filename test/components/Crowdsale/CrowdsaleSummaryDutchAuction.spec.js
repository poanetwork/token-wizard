import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { CrowdsaleSummaryDutchAuction } from '../../../src/components/Crowdsale/CrowdsaleSummaryDutchAuction'

configure({ adapter: new Adapter() })

describe(`CrowdsaleSummaryDutchAuction`, () => {
  it(`should have some .cs-CrowdsaleSummaryItem children`, () => {
    const crowdsaleSummaryDutchAuctionData = {
      contributorsCount: '5',
      currentRatePerETH: '1000',
      endRatePerETH: '1000',
      startRatePerETH: '50',
      tokensClaimed: '50',
      totalSupply: '100'
    }

    const wrapper = mount(
      <CrowdsaleSummaryDutchAuction
        contributorsCount={crowdsaleSummaryDutchAuctionData.contributorsCount}
        currentRatePerETH={crowdsaleSummaryDutchAuctionData.currentRatePerETH}
        endRatePerETH={crowdsaleSummaryDutchAuctionData.endRatePerETH}
        startRatePerETH={crowdsaleSummaryDutchAuctionData.startRatePerETH}
        tokensClaimed={crowdsaleSummaryDutchAuctionData.tokensClaimed}
        totalSupply={crowdsaleSummaryDutchAuctionData.totalSupply}
      />
    )
    const children = wrapper.find('.cs-CrowdsaleSummaryItem')

    expect(Object.keys(crowdsaleSummaryDutchAuctionData).length === children.length).toBeTruthy()
  })

  it(`should render CrowdsaleSummaryDutchAuction component`, () => {
    // Given
    const component = render.create(<CrowdsaleSummaryDutchAuction />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
