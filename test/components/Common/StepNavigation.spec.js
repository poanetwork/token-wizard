import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import { StepNavigation } from '../../../src/components/Common/StepNavigation'
import { NAVIGATION_STEPS } from '../../../src/utils/constants'
import { MemoryRouter } from 'react-router'

configure({ adapter: new Adapter() })

describe('StepNavigation', () => {
  it(`should render StepNavigation component`, () => {
    // Given
    const { CROWDSALE_STRATEGY } = NAVIGATION_STEPS
    const component = renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <StepNavigation activeStep={CROWDSALE_STRATEGY} />
      </MemoryRouter>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  describe('Steps Active', () => {
    Object.values(NAVIGATION_STEPS).forEach((activeStep, ...args) => {
      it(`should set 'active' current Step (${activeStep}) and all previous steps`, () => {
        // Given
        const array = args[1]
        const wrapper = mount(
          <MemoryRouter initialEntries={['/']}>
            <StepNavigation activeStep={activeStep} />
          </MemoryRouter>
        )

        // When
        const activeSteps = wrapper.find('StepNavigation').find('.active')

        // Then
        activeSteps.forEach((step, index) => {
          expect(step.text()).toBe(array[index])
        })
      })
    })
  })
})
