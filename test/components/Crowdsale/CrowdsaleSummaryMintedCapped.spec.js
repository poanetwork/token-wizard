import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { CrowdsaleSummaryMintedCapped } from '../../../src/components/Crowdsale/CrowdsaleSummaryMintedCapped'

configure({ adapter: new Adapter() })

describe(`CrowdsaleSummaryMintedCapped`, () => {
  it(`should have some .cs-CrowdsaleSummaryItem children`, () => {
    const crowdsaleSummaryMintedCappedData = {
      contributorsCount: '5',
      currentRatePerETH: '1000',
      tokensClaimed: '50',
      totalSupply: '100'
    }

    const wrapper = mount(
      <CrowdsaleSummaryMintedCapped
        contributorsCount={crowdsaleSummaryMintedCappedData.contributorsCount}
        currentRatePerETH={crowdsaleSummaryMintedCappedData.currentRatePerETH}
        tokensClaimed={crowdsaleSummaryMintedCappedData.tokensClaimed}
        totalSupply={crowdsaleSummaryMintedCappedData.totalSupply}
      />
    )
    const children = wrapper.find('.cs-CrowdsaleSummaryItem')

    expect(Object.keys(crowdsaleSummaryMintedCappedData).length === children.length).toBeTruthy()
  })

  it(`should render CrowdsaleSummaryMintedCapped component`, () => {
    // Given
    const component = render.create(<CrowdsaleSummaryMintedCapped />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
