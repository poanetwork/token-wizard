import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { CrowdsaleEmptyList } from '../../../src/components/Crowdsales/CrowdsaleEmptyList'

configure({ adapter: new Adapter() })

describe('CrowdsaleEmptyList', () => {
  const account = 'test account'

  it('should render screen with shallow without throwing an error', () => {
    // Given
    const wrapper = shallow(<CrowdsaleEmptyList account={account} />)

    // When
    const tree = wrapper.find('.text-bold')

    // Then
    expect(tree).toMatchSnapshot()
    expect(tree.text()).toBe(account)
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/crowdsales']}>
        <CrowdsaleEmptyList account={account} />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.text-bold')

    // Then
    expect(tree).toMatchSnapshot()
    expect(tree.text()).toBe(account)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/crowdsales']}>
        <CrowdsaleEmptyList account={account} />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.text-bold')

    // Then
    expect(tree).toMatchSnapshot()
    expect(tree.text()).toBe(account)
  })

  it('should render screen with render without account and without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/crowdsales']}>
        <CrowdsaleEmptyList />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.text-bold')

    // Then
    expect(tree).toMatchSnapshot()
    expect(tree.text()).toBe('')
  })
})
