import React from 'react'
import { Form } from 'react-final-form'
import { StepThreeFormMintedCapped } from '../../../src/components/StepThree/StepThreeFormMintedCapped'
import { Provider } from 'mobx-react'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import setFieldTouched from 'final-form-set-field-touched'
import arrayMutators from 'final-form-arrays'
import { GAS_PRICE } from '../../../src/utils/constants'
import {
  crowdsaleStore,
  gasPriceStore,
  generalStore,
  reservedTokenStore,
  tierStore,
  tokenStore
} from '../../../src/stores/index'
import MockDate from 'mockdate'
import { tierDurationUpdater } from '../../../src/components/StepThree/utils'

configure({ adapter: new Adapter() })
jest.mock('react-dropzone', () => () => <span>Dropzone</span>)

const currentTime = '2018-03-12T11:00:00'
MockDate.set(currentTime)

describe('StepThreeFormMintedCapped', () => {
  const stores = { crowdsaleStore, gasPriceStore, generalStore, reservedTokenStore, tierStore, tokenStore }
  const walletAddress = '0xAC7022d55dA6C8BB229b1Ba3Ce8A16724FF79c4A'

  beforeEach(() => {
    tierStore.addCrowdsale(walletAddress)
    generalStore.setGasTypeSelected(GAS_PRICE.SLOW)
  })

  afterEach(() => {
    tierStore.reset()
    generalStore.reset()
  })

  it(`should render StepThreeFormMintedCapped`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <Form
          onSubmit={jest.fn()}
          decorators={[jest.fn()]}
          initialValues={{
            gasPrice: GAS_PRICE.SLOW,
            tiers: tierStore.tiers.slice(),
            walletAddress: walletAddress,
            whitelistEnabled: 'no'
          }}
          mutators={{ ...arrayMutators, setFieldTouched }}
          history={{ push: jest.fn() }}
          firstLoad={true}
          component={StepThreeFormMintedCapped}
          {...stores}
        />
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should add a tier after clicking 'AddTierButton'`, () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <Form
          onSubmit={jest.fn()}
          decorators={[jest.fn()]}
          initialValues={{
            gasPrice: GAS_PRICE.SLOW,
            tiers: tierStore.tiers.slice(),
            walletAddress: walletAddress,
            whitelistEnabled: 'no'
          }}
          mutators={{ ...arrayMutators, setFieldTouched }}
          history={{ push: jest.fn() }}
          firstLoad={true}
          component={StepThreeFormMintedCapped}
          {...stores}
        />
      </Provider>
    )

    // When
    wrapper.find('AddTierButton').simulate('click')

    // Then
    expect(tierStore.tiers).toHaveLength(2)
  })

  it(`should update 2nd tier's start time, after changing 1st tier's end time`, () => {
    // Given
    tierStore.addCrowdsale()
    const calculator = tierDurationUpdater(tierStore.tiers)
    const wrapper = mount(
      <Provider {...stores}>
        <Form
          onSubmit={jest.fn()}
          decorators={[calculator]}
          initialValues={{
            gasPrice: GAS_PRICE.SLOW,
            tiers: tierStore.tiers.slice(),
            walletAddress: walletAddress,
            whitelistEnabled: 'no'
          }}
          mutators={{ ...arrayMutators, setFieldTouched }}
          history={{ push: jest.fn() }}
          firstLoad={true}
          component={StepThreeFormMintedCapped}
          {...stores}
        />
      </Provider>
    )
    const newEndTime = '2018-03-14T00:00'

    // When
    wrapper.find('input[name="tiers[0].endTime"]').simulate('change', { target: { value: newEndTime } })
    wrapper.update()

    // Then
    expect(wrapper.find('input[name="tiers[1].startTime"]').props().value).toBe(newEndTime)
  })
})
