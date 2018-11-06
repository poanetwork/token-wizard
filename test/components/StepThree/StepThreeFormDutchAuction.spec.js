import React from 'react'
import { Form } from 'react-final-form'
import { StepThreeFormDutchAuction } from '../../../src/components/StepThree/StepThreeFormDutchAuction'
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
import { weiToGwei } from '../../../src/utils/utils'

configure({ adapter: new Adapter() })
jest.mock('react-dropzone', () => () => <span>Dropzone</span>)

const currentTime = '2018-03-12T11:00:00'
MockDate.set(currentTime)

describe('StepThreeFormDutchAuction', () => {
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

  it(`should render StepThreeFormDutchAuction`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <Form
          onSubmit={jest.fn()}
          decorators={[jest.fn()]}
          initialValues={{
            burnExcess: false,
            gasPrice: GAS_PRICE.SLOW,
            tiers: tierStore.tiers.slice(),
            walletAddress: walletAddress,
            whitelistEnabled: 'no'
          }}
          mutators={{ ...arrayMutators, setFieldTouched }}
          history={{ push: jest.fn() }}
          firstLoad={true}
          updateGasTypeSelected={jest.fn()}
          component={StepThreeFormDutchAuction}
          {...stores}
        />
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should call updateGasTypeSelected`, () => {
    // Given
    const updateGasTypeSelected = jest.fn()
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
          firstLoad={false}
          updateGasTypeSelected={updateGasTypeSelected}
          component={StepThreeFormDutchAuction}
          {...stores}
        />
      </Provider>
    )
    const fast = gasPriceStore.gasPrices[2]
    fast.price = weiToGwei(fast.price)

    // When
    wrapper
      .find('.sw-GasPriceInput_SelectInput')
      .find(`[value="${GAS_PRICE.FAST.id}"]`)
      .simulate('click')

    // Then
    expect(updateGasTypeSelected).toHaveBeenCalled()
    expect(updateGasTypeSelected).toHaveBeenCalledTimes(1)
    expect(updateGasTypeSelected).toHaveBeenCalledWith(fast)
  })
})
