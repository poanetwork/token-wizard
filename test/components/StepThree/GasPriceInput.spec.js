import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import GasPriceInput from '../../../src/components/StepThree/GasPriceInput'
import { Form } from 'react-final-form'
import { gasPriceStore, generalStore } from '../../../src/stores'
import { GAS_PRICE } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })
jest.mock('../../../src/utils/api')
const stores = { generalStore }

describe('GasPriceInput', () => {
  beforeEach(() => {
    generalStore.setGasTypeSelected(GAS_PRICE.SLOW)
  })

  it(`should render GasPriceInput component`, () => {
    // Given
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        render={() => (
          <GasPriceInput
            input={{ name: 'gasPrice' }}
            gasPrices={gasPriceStore.gasPricesInGwei}
            updateGasTypeSelected={jest.fn()}
            validate={jest.fn()}
            {...stores}
          />
        )}
      />
    )

    // When
    const tree = wrapper.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should render GasPriceInput component with custom gasType selected`, () => {
    // Given
    generalStore.setGasTypeSelected(GAS_PRICE.CUSTOM)
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        render={() => (
          <GasPriceInput
            input={{ name: 'gasPrice', onChange: jest.fn() }}
            gasPrices={gasPriceStore.gasPricesInGwei}
            updateGasTypeSelected={jest.fn()}
            validate={jest.fn()}
            {...stores}
          />
        )}
      />
    )

    // When
    wrapper
      .find('.sw-GasPriceInput_SelectInput')
      .find(`[value="${GAS_PRICE.CUSTOM.id}"]`)
      .simulate('click')

    // Then
    expect(wrapper).toMatchSnapshot()
  })

  it(`should store the custom value`, () => {
    // Given
    generalStore.setGasTypeSelected(GAS_PRICE.CUSTOM)
    const onChange = jest.fn()
    const customValue = '12'
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        render={() => (
          <GasPriceInput
            input={{ name: 'gasPrice', onChange: onChange }}
            gasPrices={gasPriceStore.gasPricesInGwei}
            updateGasTypeSelected={jest.fn()}
            validate={jest.fn()}
            {...stores}
          />
        )}
      />
    )

    // When
    wrapper
      .find('.sw-GasPriceInput_SelectInput')
      .find(`[value="${GAS_PRICE.CUSTOM.id}"]`)
      .simulate('click')
    wrapper.find('#customGasPrice').simulate('change', { target: { value: customValue } })

    // Then
    expect(onChange).toHaveBeenCalledWith({ id: GAS_PRICE.CUSTOM.id, price: customValue })
  })

  it(`should select 'fast' option`, () => {
    // Given
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        render={() => (
          <GasPriceInput
            input={{ name: 'gasPrice', onChange: jest.fn() }}
            gasPrices={gasPriceStore.gasPricesInGwei}
            updateGasTypeSelected={jest.fn()}
            validate={jest.fn()}
            {...stores}
          />
        )}
      />
    )

    // When
    wrapper
      .find('.sw-GasPriceInput_SelectInput')
      .find(`[value="${GAS_PRICE.FAST.id}"]`)
      .simulate('click')

    // Then
    expect(
      wrapper
        .find('.sw-GasPriceInput_SelectInput')
        .find(`[value="${GAS_PRICE.FAST.id}"]`)
        .props('checked')
    ).toBeTruthy()
  })

  it(`should remove 'mousedown' event listener`, () => {
    // Given
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        render={() => (
          <GasPriceInput
            input={{ name: 'gasPrice', onChange: jest.fn() }}
            gasPrices={gasPriceStore.gasPricesInGwei}
            updateGasTypeSelected={jest.fn()}
            validate={jest.fn()}
            {...stores}
          />
        )}
      />
    )
    const gasPriceInputInstance = wrapper.find(GasPriceInput).instance().wrappedInstance
    const willUnmount = jest.spyOn(gasPriceInputInstance, 'componentWillUnmount')

    // When
    wrapper.unmount()

    // Then
    expect(willUnmount).toHaveBeenCalled()
  })

  it(`should display the dropdown with the options`, () => {
    // Given
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        render={() => (
          <GasPriceInput
            input={{ name: 'gasPrice', onChange: jest.fn() }}
            gasPrices={gasPriceStore.gasPricesInGwei}
            updateGasTypeSelected={jest.fn()}
            validate={jest.fn()}
            {...stores}
          />
        )}
      />
    )
    const gasPriceInputInstance = wrapper.find(GasPriceInput).instance().wrappedInstance
    const openDropdownHandler = jest.spyOn(gasPriceInputInstance, 'openDropdown')

    // When
    wrapper.find('.sw-GasPriceInput_SelectButton').simulate('click')

    // Then
    expect(openDropdownHandler).toHaveBeenCalled()
    expect(openDropdownHandler).toHaveBeenCalledTimes(1)
    expect(wrapper.find(GasPriceInput).instance().wrappedInstance.state.openDropdown).toBeTruthy()
  })

  // On hold until find how dispatch a 'mousedown' event
  // it(`should close dropdown when clicking outside of it`, () => {
  //   // Given
  //   const div = global.document.createElement('div')
  //   global.document.body.appendChild(div)
  //   const mousedownEvent = new MouseEvent('mousedown', {
  //     bubbles: true,
  //     cancelable: true
  //   })
  //   const wrapper = mount(
  //     <Form
  //       onSubmit={jest.fn()}
  //       initialValues={{}}
  //       render={() => (
  //         <GasPriceInput
  //           input={{ name: 'gasPrice', onChange: jest.fn() }}
  //           gasPrices={gasPriceStore.gasPricesInGwei}
  //           updateGasTypeSelected={jest.fn()}
  //           validate={jest.fn()}
  //           {...stores}
  //         />
  //       )}
  //     />,
  //     { attachTo: div }
  //   )
  //   const gasPriceInputInstance = wrapper.find(GasPriceInput).instance().wrappedInstance
  //   const clickOutsideHandler = jest.spyOn(gasPriceInputInstance, 'handleClickOutside')
  //
  //   // When
  //   wrapper.find('.sw-GasPriceInput_SelectButton').simulate('click')
  //   document.querySelectorAll('.sw-FormControlTitle_Info')[0].dispatchEvent(mousedownEvent)
  //
  //   // Then
  //   expect(clickOutsideHandler).toHaveBeenCalled()
  //   expect(clickOutsideHandler).toHaveBeenCalledTimes(1)
  //   expect(wrapper.find(GasPriceInput).instance().wrappedInstance.state.openDropdown).toBeFalsy()
  // })
})
