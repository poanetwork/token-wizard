import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { StrategyItem } from '../../../src/components/StepOne/StrategyItem'
import { strategies } from '../../../src/utils/strategies'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('StrategyItem', () => {
  const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES

  const strategyMintedCappedPropsChecked = {
    strategy: MINTED_CAPPED_CROWDSALE,
    strategyType: strategies[0].type,
    strategyDisplayTitle: strategies[0].display,
    stragegyDisplayDescription: strategies[0].description,
    handleChange: jest.fn()
  }

  const strategyDutchPropsChecked = {
    strategy: DUTCH_AUCTION,
    strategyType: strategies[1].type,
    strategyDisplayTitle: strategies[1].display,
    stragegyDisplayDescription: strategies[1].description,
    handleChange: jest.fn()
  }

  const strategyMintedCappedPropsUnchecked = {
    strategy: DUTCH_AUCTION,
    strategyType: strategies[0].type,
    strategyDisplayTitle: strategies[0].display,
    stragegyDisplayDescription: strategies[0].description,
    handleChange: jest.fn()
  }

  const strategyDutchPropsUnchecked = {
    strategy: MINTED_CAPPED_CROWDSALE,
    strategyType: strategies[1].type,
    strategyDisplayTitle: strategies[1].display,
    stragegyDisplayDescription: strategies[1].description,
    handleChange: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    // Given
    const wrapper = shallow(<StrategyItem {...strategyMintedCappedPropsChecked} />)

    // When
    const tree = wrapper.find('input.sw-RadioItems_InputRadio')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(<StrategyItem {...strategyMintedCappedPropsChecked} />)

    // When
    const tree = wrapper.find('input.sw-RadioItems_InputRadio')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(<StrategyItem {...strategyMintedCappedPropsChecked} />)

    // When
    const tree = wrapper.find('input.sw-RadioItems_InputRadio')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen for minted strategy and checked value true', () => {
    // Given
    const wrapper = shallow(<StrategyItem {...strategyMintedCappedPropsChecked} />)

    // When
    let checkbox = wrapper.find({ type: 'radio' })

    // Then
    expect(checkbox.props().checked).toEqual(true)
  })

  it('should render screen for minted strategy and checked value false', () => {
    // Given
    const wrapper = shallow(<StrategyItem {...strategyMintedCappedPropsUnchecked} />)

    // When
    let checkbox = wrapper.find({ type: 'radio' })

    // Then
    expect(checkbox.props().checked).toEqual(false)
  })

  it('should render screen for dutch strategy and checked value true', () => {
    // Given
    const wrapper = shallow(<StrategyItem {...strategyDutchPropsChecked} />)

    // When
    let checkbox = wrapper.find({ type: 'radio' })

    // Then
    expect(checkbox.props().checked).toEqual(true)
  })

  it('should render screen for dutch strategy and checked value false', () => {
    // Given
    const wrapper = shallow(<StrategyItem {...strategyDutchPropsUnchecked} />)

    // When
    let checkbox = wrapper.find({ type: 'radio' })

    // Then
    expect(checkbox.props().checked).toEqual(false)
  })
})
