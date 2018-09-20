import React from 'react'
import ReservedTokensItem from '../../../src/components/Common/ReservedTokensItem'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

const token = {
  addr: '0x1111111111111111111111111111111111111111',
  dim: 'percentage',
  val: '12.1234'
}

describe('ReservedTokensItem', () => {
  // TODO: modify this test after component refactor
  // it(`should render the component with delete button enabled`, () => {
  //   const wrapper = mount(
  //     shallow(
  //       <ReservedTokensItem key={0} num={0} addr={token.addr} dim={token.dim} val={token.val} readOnly={false} />
  //     ).get(0)
  //   )
  //
  //   expect(wrapper).toMatchSnapshot()
  //   expect(wrapper.find('.reserved-tokens-item-empty')).toHaveLength(1)
  // })

  it(`should render the component with no delete button`, () => {
    const wrapper = mount(
      shallow(
        <ReservedTokensItem key={0} num={0} addr={token.addr} dim={token.dim} val={token.val} readOnly={true} />
      ).get(0)
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('reserved-tokens-item-empty')).toHaveLength(0)
  })

  // TODO: modify this test after component refactor
  // it(`should receive the item index on remove button click`, () => {
  //   const onRemove = jest.fn()
  //   const wrapper = mount(
  //     <ReservedTokensItem
  //       key={0}
  //       num={0}
  //       addr={token.addr}
  //       dim={token.dim}
  //       val={token.val}
  //       readOnly={false}
  //       onRemove={onRemove}
  //     />
  //   )
  //
  //   wrapper.find('a').simulate('click')
  //
  //   expect(onRemove).toHaveBeenCalledTimes(1)
  //   expect(onRemove).toHaveBeenLastCalledWith(0)
  // })
})
