import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import AddTierButton from '../../../src/components/StepThree/AddTierButton'

configure({ adapter: new Adapter() })

describe('AddTierButton', () => {
  it(`should render AddTierButton`, () => {
    // Given
    const wrapper = renderer.create(<AddTierButton onClick={jest.fn()} />)

    // When
    const tree = wrapper.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should call onClick prop`, () => {
    // Given
    const onClick = jest.fn()
    const wrapper = mount(<AddTierButton onClick={onClick} />)

    // When
    wrapper.find(AddTierButton).simulate('click')

    // Then
    expect(onClick).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
