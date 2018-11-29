import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow, mount } from 'enzyme'
import { ButtonCopyToClipboard } from '../../../src/components/Common/ButtonCopyToClipboard'

// Mock the 'copy' function to avoid it...
import { copy, showClipboardCopyToast } from '../../../src/utils/copy'
jest.mock('../../../src/utils/copy')

configure({ adapter: new Adapter() })

describe(`ButtonCopyToClipboard`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonCopyToClipboard />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonCopyToClipboard />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should have a value to copy`, () => {
    const value = 'Value to copy'
    const wrapper = shallow(<ButtonCopyToClipboard value={value} />)

    expect(wrapper.prop('data-clipboard-text')).toBe(value)
  })

  it(`should call onClick event`, () => {
    const value = 'Value to copy'
    const wrapper = mount(<ButtonCopyToClipboard value={value} />)
    const button = wrapper.find('.sw-ButtonCopyToClipboard')

    button.simulate('click')

    expect(showClipboardCopyToast).toHaveBeenCalled()
  })

  it(`should render ButtonCopyToClipboard component`, () => {
    // Given
    const component = render.create(<ButtonCopyToClipboard title="Clipboard title text" />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
