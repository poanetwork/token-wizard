import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { CrowdsaleSummaryItem } from '../../../src/components/Crowdsale/CrowdsaleSummaryItem'

configure({ adapter: new Adapter() })

describe(`CrowdsaleSummaryItem`, () => {
  it(`should contain an element to display the title's text`, () => {
    const theTitle = 'The title'
    const wrapper = shallow(<CrowdsaleSummaryItem title={theTitle} />)
    const itemTitle = wrapper.find('.cs-CrowdsaleSummaryItem_Title')

    expect(itemTitle.exists()).toBeTruthy()
    expect(itemTitle.text()).toBe(theTitle)
  })

  it(`should contain an element to display the description's text`, () => {
    const theDescription = "The item's description"
    const wrapper = shallow(<CrowdsaleSummaryItem description={theDescription} />)
    const itemDescription = wrapper.find('.cs-CrowdsaleSummaryItem_Description')

    expect(itemDescription.exists()).toBeTruthy()
    expect(itemDescription.text()).toBe(theDescription)
  })

  it(`should render CrowdsaleSummaryItem component`, () => {
    const theTitle = 'The title'
    const theDescription = "The item's description"

    // Given
    const component = render.create(<CrowdsaleSummaryItem title={theTitle} description={theDescription} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
