import React from 'react'
import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
import { MemoryRouter } from 'react-router'
import CheckIncompleteDeploy from '../../src/components/CheckIncompleteDeploy'

configure({ adapter: new Adapter() })

describe('CheckIncompleteDeploys', () => {
  const history = { push: jest.fn() }
  it(`should render CheckIncompleteDeploys`, () => {
    // Given
    const component = renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <CheckIncompleteDeploy />
      </MemoryRouter>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should navigate to StepFour`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <CheckIncompleteDeploy history={history} />
      </MemoryRouter>
    )

    // When
    const checkIncompleteDeployComponent = wrapper.find('CheckIncompleteDeploy')
    const navigateToHandler = jest.spyOn(checkIncompleteDeployComponent.instance(), 'goToStepFour')
    wrapper.update()
    checkIncompleteDeployComponent
      .find('.buttons button')
      .at(0)
      .simulate('click')

    // Then
    expect(navigateToHandler).toHaveBeenCalledTimes(1)
  })

  it(`should cancel the deploy`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <CheckIncompleteDeploy />
      </MemoryRouter>
    )

    // When
    const checkIncompleteDeployComponent = wrapper.find('CheckIncompleteDeploy')
    const cancelHandler = jest.spyOn(checkIncompleteDeployComponent.instance(), 'cancel')
    wrapper.update()
    checkIncompleteDeployComponent
      .find('.buttons button')
      .at(1)
      .simulate('click')

    // Then
    expect(cancelHandler).toHaveBeenCalledTimes(1)
  })
})
