import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonContinue } from '../../../src/components/Common/ButtonContinue'

configure({ adapter: new Adapter() })

describe(`ButtonContinue`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonContinue />)

    expect(wrapper.type()).toBe('button')
  })

  it(`should contain a span with the .sw-ButtonContinue_Text class containing the button's text`, () => {
    const theButtonText = 'The button text'
    const wrapper = shallow(<ButtonContinue buttonText={theButtonText} onClick={jest.fn()} />)
    const buttonChild = wrapper.find('span.sw-ButtonContinue_Text')

    expect(buttonChild.exists()).toBeTruthy()
    expect(buttonChild.text()).toBe(theButtonText)
  })

  it(`should render ButtonContinue component`, () => {
    // Given
    const component = render.create(<ButtonContinue onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
