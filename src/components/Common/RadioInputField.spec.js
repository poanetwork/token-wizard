import React from 'react';
import { RadioInputField } from './RadioInputField';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-15';
import { configure, mount } from 'enzyme';

configure({ adapter: new Adapter() })

test('Should render the component', () => {
  const component = renderer.create(
    <RadioInputField
      title="Some Title"
      items={[{ label: 'Item 1', value: 'item-1' }, { label: 'Item 2', value: 'item-2' }]}
      selectedItem="item-1"
      onChange={() => {}}
      description="Some Description"
    />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should render two inputs and check the first one', () => {
  const wrapper = mount(
    <RadioInputField
      title="Some Title"
      items={[{ label: 'Item 1', value: 'item-1' }, { label: 'Item 2', value: 'item-2' }]}
      selectedItem="item-1"
      onChange={() => {}}
      description="Some Description"
    />
  );

  const inputs = wrapper.find('input[type="radio"]')
  expect(inputs.length).toBe(2)

  const firstInput = inputs.at(0)
  const secondInput = inputs.at(1)

  expect(firstInput.prop('checked')).toBe(true)
  expect(secondInput.prop('checked')).toBe(false)
})

test('The onChange callback is called when an item is selected', () => {
  const onChangeCallback = jest.fn()

  const wrapper = mount(
    <RadioInputField
      title="Some Title"
      items={[{ label: 'Item 1', value: 'item-1' }, { label: 'Item 2', value: 'item-2' }]}
      selectedItem="item-1"
      onChange={onChangeCallback}
      description="Some Description"
    />
  );

  wrapper.find('input[type="radio"]').at(1).simulate('change')

  expect(onChangeCallback).toBeCalled()
})

test('Should change the selected item when `selectedItem` changes', () => {
  const onChangeCallback = jest.fn()

  const wrapper = mount(
    <RadioInputField
      title="Some Title"
      items={[{ label: 'Item 1', value: 'item-1' }, { label: 'Item 2', value: 'item-2' }]}
      selectedItem="item-1"
      onChange={onChangeCallback}
      description="Some Description"
    />
  );

  let inputs = wrapper.find('input[type="radio"]')
  expect(inputs.length).toBe(2)

  let firstInput = inputs.at(0)
  let secondInput = inputs.at(1)

  expect(firstInput.prop('checked')).toBe(true)
  expect(secondInput.prop('checked')).toBe(false)

  wrapper.setProps({ selectedItem: 'item-2' })

  inputs = wrapper.find('input[type="radio"]')
  expect(inputs.length).toBe(2)

  firstInput = inputs.at(0)
  secondInput = inputs.at(1)

  expect(firstInput.prop('checked')).toBe(false)
  expect(secondInput.prop('checked')).toBe(true)
})
