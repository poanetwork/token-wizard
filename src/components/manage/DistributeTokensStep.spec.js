import React from 'react'
import { StaticRouter } from 'react-router'
import { DistributeTokensStep } from './DistributeTokensStep'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

describe('DistributeTokensStep', () => {
  it('should render the component with active button', () => {
    const distributeTokensStateParams = {
      disabled: false,
      handleClick: jest.fn()
    }

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('should render the component with disabled button', () => {
    const distributeTokensStateParams = {
      disabled: true,
      handleClick: jest.fn()
    }

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('should call handleClick', () => {
    const distributeTokensStateParams = {
      disabled: false,
      handleClick: jest.fn()
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    )

    const button = wrapper.find('Link').at(0)

    button.simulate('click')

    expect(distributeTokensStateParams.handleClick).toHaveBeenCalled()
  })

  it('should not call handleClick', () => {
    const distributeTokensStateParams = {
      disabled: true,
      handleClick: jest.fn()
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    )

    const button = wrapper.find('Link').at(0)

    button.simulate('click')

    expect(distributeTokensStateParams.handleClick).toHaveBeenCalledTimes(0)
  })
})
