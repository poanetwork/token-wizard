import React from 'react'
import CountdownTimer from '../../../src/components/contribute/CountdownTimer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

describe('CountdownTimer', () => {
  it('Should render the component', () => {
    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={false}
        nextTick={{ type: 'start', order: 1 }}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445}
        onComplete={jest.fn()}
        isFinalized={false}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Should render the component showing only the seconds', () => {
    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={true}
        nextTick={{ type: 'start', order: 1 }}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445}
        onComplete={jest.fn()}
        isFinalized={false}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Should render the component showing the time until the end of the tier', () => {
    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={false}
        nextTick={{ type: 'end', order: 1 }}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445}
        onComplete={jest.fn()}
        isFinalized={false}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Should render the component when the crowdsale ended', () => {
    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={false}
        nextTick={{}}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445}
        onComplete={jest.fn()}
        isFinalized={false}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Should render the component when the crowdsale was finalized', () => {
    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={false}
        nextTick={{ type: 'start', order: 1 }}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445}
        onComplete={jest.fn()}
        isFinalized={true}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it(`Should render the component with alternative message`, () => {
    const altMessage = 'Alternative Message'

    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={false}
        nextTick={{ type: 'start', order: 1 }}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445}
        onComplete={jest.fn()}
        isFinalized={false}
        altMessage={altMessage}
      />
    )
    expect(wrapper).toMatchSnapshot()

    const altMessageText = wrapper.find('.timer__altMessage').text()
    expect(altMessageText).toBe(altMessage)
  })

  it(`Should stop countdown if crowdsale was finalized`, () => {
    const wrapper = shallow(
      <CountdownTimer
        displaySeconds={false}
        nextTick={{ type: 'start', order: 1 }}
        tiersLength={2}
        days={1}
        hours={4}
        minutes={45}
        seconds={30}
        msToNextTick={30445000}
        onComplete={jest.fn()}
        isFinalized={true}
      />
    )

    expect(wrapper.find('ReactCountdownClock').props().seconds).toBe(0)
  })
})
