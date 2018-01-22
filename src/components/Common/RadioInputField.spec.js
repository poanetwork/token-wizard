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
      onChange={onChangeCallback}
      description="Some Description"
    />
  );

  wrapper.find('input[type="radio"]').at(1).simulate('change')

  expect(onChangeCallback).toBeCalled()
})

test('Should accept a defaultValue prop', () => {
  const items = [{ label: 'Item 1', value: 'item-1' }, { label: 'Item 2', value: 'item-2' }]
  const wrapper = mount(
    <RadioInputField
      title="Some Title"
      items={items}
      defaultValue={items[1].value}
      onChange={() => {}}
      description="Some Description"
    />
  );

  const firstInput = wrapper.find('input[type="radio"]').at(0)
  const secondInput = wrapper.find('input[type="radio"]').at(1)

  expect(firstInput.prop('checked')).toBe(false)
  expect(secondInput.prop('checked')).toBe(true)
})
