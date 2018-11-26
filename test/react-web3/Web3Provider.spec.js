import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import Web3Provider from '../../src/react-web3/Web3Provider'
import renderer from 'react-test-renderer'
import DeploymentStore from '../../src/stores/DeploymentStore'

configure({ adapter: new Adapter() })

describe('Web3Provider', () => {
  let deploymentStore

  beforeEach(() => {
    deploymentStore = new DeploymentStore()
  })

  it(`should render the component `, () => {
    const wrapper = renderer.create(<Web3Provider />)

    expect(wrapper).toMatchSnapshot()
  })
})
