import React from 'react'
import { TierBlock } from '../../../src/components/Common/TierBlock'
import { Form } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import TierStore from '../../../src/stores/TierStore'
import { defaultTier, defaultTierValidations } from '../../../src/utils/constants'
import { VALIDATION_TYPES, VALIDATION_MESSAGES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('TierBlock ', () => {
  let tierStore = new TierStore()
  const fields = [['tierblock', 0]]

  const addCrowdsale = num => {
    const newTier = Object.assign({}, defaultTier)
    const newTierValidations = Object.assign({}, defaultTierValidations)
    newTier.tier = `Tier ${num + 1}`
    if (0 === num) {
      newTier.whitelistEnabled = 'no'
      newTier.walletAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
      newTier.endTime = 1234
    }

    tierStore.addTier(newTier, newTierValidations)
  }

  // tiers[index].endTime

  it(`should render TierBlock component`, () => {
    addCrowdsale(0)
    const wrapper = renderer.create(
      <Form
        index={0}
        onSubmit={jest.fn()}
        tierStore={tierStore}
        component={TierBlock}
        initialValues={tierStore}
        fields={fields}
        disabled={false}
        decimals={18}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
