import React from 'react'
import { Form } from 'react-final-form'
import { StepThreeFormDutchAuction } from '../../../src/components/StepThree/StepThreeFormDutchAuction'
import { Provider } from 'mobx-react'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import setFieldTouched from 'final-form-set-field-touched'
import arrayMutators from 'final-form-arrays'
import { CONTRIBUTION_OPTIONS, GAS_PRICE } from '../../../src/utils/constants'
import {
  crowdsaleStore,
  gasPriceStore,
  generalStore,
  reservedTokenStore,
  tierStore,
  tokenStore
} from '../../../src/stores'
import MockDate from 'mockdate'
import { weiToGwei } from '../../../src/utils/utils'
import { ReservedTokensInputBlock } from '../../../src/components/Common/ReservedTokensInputBlock'

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

  it(`should render StepThreeFormDutchAuction- test snapshots`, () => {
    const component = renderer
      .create(
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
            goBack={jest.fn()}
            goBackEnabled={jest.fn()}
          />
        </Provider>
      )
      .toJSON()

    expect(component).toMatchSnapshot()
  })

  it(`should render StepThreeFormDutchAuction- test snapshot form`, () => {
    const props = {
      onSubmit: jest.fn(),
      decorators: jest.fn(),
      values: {
        burnExcess: false,
        gasPrice: GAS_PRICE.SLOW,
        tiers: tierStore.tiers.slice(),
        walletAddress: walletAddress,
        whitelistEnabled: 'no'
      },
      generalStore: generalStore,
      crowdsaleStore: crowdsaleStore,
      gasPriceStore: gasPriceStore,
      reservedTokenStore: reservedTokenStore,
      tierStore: tierStore,
      tokenStore: tokenStore,
      form: { mutators: {} }
    }
    const FormComponent = mount(
      <Provider {...stores}>
        <StepThreeFormDutchAuction {...props} />
      </Provider>
    )

    expect(FormComponent).toMatchSnapshot()
  })

  it(`should render StepThreeFormDutchAuction- test props I`, () => {
    const props = {
      onSubmit: jest.fn(),
      decorators: jest.fn(),
      values: {
        burnExcess: false,
        gasPrice: GAS_PRICE.SLOW,
        tiers: tierStore.tiers.slice(),
        walletAddress: walletAddress,
        whitelistEnabled: 'no'
      },
      generalStore: generalStore,
      crowdsaleStore: crowdsaleStore,
      gasPriceStore: gasPriceStore,
      reservedTokenStore: reservedTokenStore,
      tierStore: tierStore,
      tokenStore: tokenStore,
      form: { mutators: {} }
    }
    const FormComponent = mount(
      <Provider {...stores}>
        <StepThreeFormDutchAuction {...props} />
      </Provider>
    )

    const componentInstance = FormComponent.instance()

    FormComponent.find('input[name="burnExcessRadioButtons"]')
      .at(0)
      .simulate('click')

    expect(
      FormComponent.find('input[name="burnExcessRadioButtons"]')
        .find(`[value="yes"]`)
        .props('checked')
    ).toBeTruthy()
  })

  it(`should render StepThreeFormDutchAuction- test props II`, () => {
    const props = {
      onSubmit: jest.fn(),
      decorators: jest.fn(),
      values: {
        burnExcess: false,
        gasPrice: GAS_PRICE.SLOW,
        tiers: tierStore.tiers.slice(),
        walletAddress: walletAddress,
        whitelistEnabled: 'no'
      },
      generalStore: generalStore,
      crowdsaleStore: crowdsaleStore,
      gasPriceStore: gasPriceStore,
      reservedTokenStore: reservedTokenStore,
      tierStore: tierStore,
      tokenStore: tokenStore,
      form: { mutators: {} }
    }
    const FormComponent = mount(
      <Provider {...stores}>
        <StepThreeFormDutchAuction {...props} />
      </Provider>
    )

    const componentInstance = FormComponent.instance()

    FormComponent.find('input[name="burnExcessRadioButtons"]')
      .at(1)
      .simulate('click')

    expect(
      FormComponent.find('input[name="burnExcessRadioButtons"]')
        .find(`[value="no"]`)
        .props('checked')
    ).toBeTruthy()
  })

  it(`should render StepThreeFormDutchAuction- test props III`, () => {
    const props = {
      onSubmit: jest.fn(),
      decorators: jest.fn(),
      values: {
        burnExcess: false,
        gasPrice: GAS_PRICE.SLOW,
        tiers: tierStore.tiers.slice(),
        walletAddress: walletAddress,
        whitelistEnabled: 'no'
      },
      generalStore: generalStore,
      crowdsaleStore: crowdsaleStore,
      gasPriceStore: gasPriceStore,
      reservedTokenStore: reservedTokenStore,
      tierStore: tierStore,
      tokenStore: tokenStore,
      form: { mutators: {} }
    }
    const FormComponent = mount(
      <Provider {...stores}>
        <StepThreeFormDutchAuction {...props} />
      </Provider>
    )

    const componentInstance = FormComponent.instance()

    FormComponent.find('input[name="burnExcessRadioButtons"]')
      .at(1)
      .simulate('change', { target: { value: 'yes' } })

    expect(
      FormComponent.find('input[name="burnExcessRadioButtons"]')
        .find(`[value="yes"]`)
        .props('checked')
    ).toBeTruthy()
  })

  it(`should render StepThreeFormDutchAuction- test submit`, () => {
    const onSubmit = jest.fn()

    const props = {
      handleSubmit: onSubmit,
      decorators: jest.fn(),
      values: {
        burnExcess: false,
        gasPrice: GAS_PRICE.SLOW,
        tiers: tierStore.tiers.slice(),
        walletAddress: walletAddress,
        whitelistEnabled: 'no'
      },
      generalStore: generalStore,
      crowdsaleStore: crowdsaleStore,
      gasPriceStore: gasPriceStore,
      reservedTokenStore: reservedTokenStore,
      tierStore: tierStore,
      tokenStore: tokenStore,
      form: { mutators: {} }
    }
    const FormComponent = mount(
      <Provider {...stores}>
        <StepThreeFormDutchAuction {...props} />
      </Provider>
    )

    const form = FormComponent.find('form').at(0)
    const children = form
      .render()
      .children()
      .children()
    form.simulate('submit', { target: { children } })

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
