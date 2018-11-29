import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import render from 'react-test-renderer'
import { ModalContainer } from '../../../src/components/Common/ModalContainer'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

describe(`ModalContainer`, () => {
  let hideTheModalWindow

  beforeEach(() => {
    hideTheModalWindow = jest.fn()
  })

  it(`should call onClick event`, () => {
    // Given
    const wrapper = mount(
      <ModalContainer showModal={true} title="Modal Title" hideModal={hideTheModalWindow} description="Some text..." />
    )

    // When
    wrapper.find('.sw-ModalWindow_CloseButton').simulate('click')

    // Then
    expect(hideTheModalWindow).toHaveBeenCalled()
    expect(hideTheModalWindow).toHaveBeenCalledTimes(1)
  })

  it(`should render ModalContainer component`, () => {
    // Given
    const component = render.create(
      <ModalContainer showModal={true} title="Modal Title" hideModal={hideTheModalWindow} description="Some text..." />
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
