import React from 'react'
import { Form } from 'react-final-form'
import { StepTwoForm } from '../../../src/components/StepTwo/StepTwoForm'
import { Provider } from 'mobx-react'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'
import { crowdsaleStore, reservedTokenStore, tokenStore } from '../../../src/stores/index'
import setFieldTouched from 'final-form-set-field-touched'

configure({ adapter: new Adapter() })
jest.mock('react-dropzone', () => () => <span>Dropzone</span>)

describe('StepTwoForm', () => {
  const stores = { tokenStore, crowdsaleStore, reservedTokenStore }

  beforeEach(() => {
    crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE)
  })

  it(`should render StepTwoForm for Minted Capped Crowdsale`, () => {
    const component = renderer.create(
      <Provider {...stores}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            name: 'This is a valid name',
            ticker: 'TTK',
            decimals: '14',
            supply: '0'
          }}
          mutators={{ setFieldTouched }}
          component={StepTwoForm}
          id="tokenData"
          reload={true}
          goBack={jest.fn()}
          goBackEnabled={jest.fn()}
        />
      </Provider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it(`should render StepTwoForm for Dutch Auction Crowdsale`, () => {
    crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.DUTCH_AUCTION)

    const component = renderer.create(
      <Provider {...stores}>
        <Form
          onSubmit={jest.fn()}
          initialValues={{
            name: 'This is a valid name',
            ticker: 'TTK',
            decimals: '14'
          }}
          mutators={{ setFieldTouched }}
          component={StepTwoForm}
          id="tokenData"
          reload={false}
          goBack={jest.fn()}
          goBackEnabled={jest.fn()}
        />
      </Provider>
    )

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Should call onSubmit if all values are valid', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Provider {...stores}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            name: 'This is a valid name',
            ticker: 'TTK',
            decimals: '14'
          }}
          component={StepTwoForm}
          id="tokenData"
          reload={false}
          goBack={jest.fn()}
          goBackEnabled={jest.fn()}
        />
      </Provider>
    )

    wrapper.simulate('submit')

    expect(onSubmit).toHaveBeenCalled()
  })

  it('Should not call onSubmit if not all values are valid', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Provider {...stores}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            name: 'This is a valid name',
            ticker: 'TTK',
            decimals: '24' // invalid value
          }}
          component={StepTwoForm}
          id="tokenData"
          reload={false}
          goBack={jest.fn()}
          goBackEnabled={jest.fn()}
        />
      </Provider>
    )

    wrapper.simulate('submit')

    expect(onSubmit).toHaveBeenCalledTimes(0)
  })
})
