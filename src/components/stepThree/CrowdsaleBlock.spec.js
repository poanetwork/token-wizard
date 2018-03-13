import React from 'react'
import TierStore from '../../stores/TierStore'
import { CrowdsaleBlock } from './CrowdsaleBlock'
import MockDate from 'mockdate'
import moment from 'moment'
import { VALIDATION_TYPES } from '../../utils/constants'
import { Provider } from 'mobx-react'
import Adapter from 'enzyme-adapter-react-15'
import toJson from 'enzyme-to-json'
import { configure, mount } from 'enzyme'
import { defaultTier, defaultTierValidations } from '../../utils/constants'

configure({ adapter: new Adapter() })

const currentTime = '2018-03-05T11:00:00'
const { INVALID } = VALIDATION_TYPES

MockDate.set(currentTime)

describe('CrowdsaleBlock', () => {
  const INPUT_EVENT = {
    CHANGE: 'change',
    CLICK: 'click'
  }

  const addCrowdsale = (num) => {
    const newTier = Object.assign({}, defaultTier)
    const newTierValidations = Object.assign({}, defaultTierValidations)

    newTier.tier = `Tier ${num + 1}`

    if (0 === num) {
      newTier.whitelistEnabled = 'no'
      newTier.walletAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
    }

    tierStore.addTier(newTier)
    tierStore.addTierValidations(newTierValidations)
  }

  let changeMock
  let tierStore
  let initialTierWrapper

  beforeEach(() => {
    tierStore = new TierStore()

    addCrowdsale(0)

    changeMock = { target: { value: '' } }

    initialTierWrapper = mount(<Provider tierStore={tierStore}><CrowdsaleBlock num={0}/></Provider>)
  })

  it('Should render the component for the first Tier', () => {
    expect(toJson(initialTierWrapper)).toMatchSnapshot()
  })

  it('Should render the component for the second Tier', () => {
    addCrowdsale(1)
    const wrapper = mount(<Provider tierStore={tierStore}><CrowdsaleBlock num={1}/></Provider>)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('Should render the component for the second Tier with whitelist enabled', () => {
    addCrowdsale(1)
    tierStore.setTierProperty('yes', 'whitelistEnabled', 0)
    const wrapper = mount(<Provider tierStore={tierStore}><CrowdsaleBlock num={1}/></Provider>)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('Should set current time + 5 minutes in startTime (first tier)', () => {
    const expectedStartTime = moment(currentTime).add(5, 'minutes')
    const startTimeValue = initialTierWrapper.find('input[type="datetime-local"]').at(0).props().value

    expect(expectedStartTime.isSame(startTimeValue)).toBeTruthy()
  })

  it('Should set endTime at the beginning of 4 days in the future of startTime (first tier)', () => {
    const expectedEndTime = moment(currentTime).add(4, 'days').startOf('day')
    const endTimeValue = initialTierWrapper.find('input[type="datetime-local"]').at(1).props().value

    expect(expectedEndTime.isSame(endTimeValue)).toBeTruthy()
  })

  it('Should set startTime at the same time as the end time of the previous tier (second tier)', () => {
    addCrowdsale(1)
    const secondTierWrapper = mount(<Provider tierStore={tierStore}><CrowdsaleBlock num={1}/></Provider>)
    const firstTierEndTimeValue = initialTierWrapper.find('input[type="datetime-local"]').at(1).props().value
    const secondTierStartTimeValue = secondTierWrapper.find('input[type="datetime-local"]').at(0).props().value

    expect(firstTierEndTimeValue).toBe(secondTierStartTimeValue)
  })

  it('Should give error if startTime of the second tier is previous to the endTime of the first tier', () => {
    addCrowdsale(1)
    const secondTierWrapper = mount(<Provider tierStore={tierStore}><CrowdsaleBlock num={1}/></Provider>)
    const firstTierEndTimeValue = initialTierWrapper.find('input[type="datetime-local"]').at(1).props().value
    const secondTierStartTime = secondTierWrapper.find('input[type="datetime-local"]').at(0)

    changeMock.target.value = moment(firstTierEndTimeValue).subtract(1, 'days').toJSON()
    secondTierStartTime.simulate(INPUT_EVENT.CHANGE, changeMock)

    const secondTierStartTimeProps = secondTierWrapper.find('InputField[title="Start Time"]').props()

    expect(moment(firstTierEndTimeValue).subtract(1, 'days').isSame(secondTierStartTimeProps.value)).toBeTruthy()
    expect(secondTierStartTimeProps.valid).toBe(INVALID)
  })

  it('Should properly apply Rate update', () => {
    const rate = initialTierWrapper.find('input[type="text"]').at(1)

    changeMock.target.value = '1234'
    rate.simulate(INPUT_EVENT.CHANGE, changeMock)

    expect(initialTierWrapper.find('BigNumberInput').props().value).toBe(changeMock.target.value)
  })

  it('Should properly update supply value', () => {
    const supply = initialTierWrapper.find('input[type="number"]').at(0)

    changeMock.target.value = '1234'
    supply.simulate(INPUT_EVENT.CHANGE, changeMock)

    expect(initialTierWrapper.find('InputField[title="Supply"]').props().value).toBe(changeMock.target.value)
  })

  it('Should properly change End Time', () => {
    const endTime = initialTierWrapper.find('input[type="datetime-local"]').at(1)
    const modifiedDate = moment(endTime).subtract(1, 'days')

    changeMock.target.value = modifiedDate.toJSON()
    endTime.simulate(INPUT_EVENT.CHANGE, changeMock)

    expect(modifiedDate.isSame(initialTierWrapper.find('InputField[title="End Time"]').props().value)).toBeTruthy()
  })

  it('Should properly change Tier name', () => {
    const tierName = initialTierWrapper.find('input[type="text"]').at(0)

    changeMock.target.value = 'The first Tier'
    tierName.simulate(INPUT_EVENT.CHANGE, changeMock)

    expect(initialTierWrapper.find('InputField[title="Crowdsale setup name"]').props().value).toBe(changeMock.target.value)
  })
})
