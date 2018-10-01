import React from 'react'
import { Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { WhenFieldChanges } from '../Common/WhenFieldChanges'
import { InputField2 } from '../Common/InputField2'
import GasPriceInput from './GasPriceInput'
import { ButtonContinue } from '../Common/ButtonContinue'
import { gweiToWei } from '../../utils/utils'
import {
  composeValidators,
  isAddress,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan
} from '../../utils/validations'
import {
  TEXT_FIELDS,
  VALIDATION_TYPES,
  VALIDATION_MESSAGES,
  DESCRIPTION,
  NAVIGATION_STEPS
} from '../../utils/constants'
import { TierBlock } from '../Common/TierBlock'
import { ButtonBack } from '../Common/ButtonBack'

const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px'
}

export const StepThreeFormMintedCapped = ({
  handleSubmit,
  values,
  invalid,
  pristine,
  submitting,
  errors,
  mutators: { push, setFieldTouched },
  form,
  reload,
  ...props
}) => {
  const status = !(submitting || invalid)

  const addTier = () => {
    props.addCrowdsale()
    const lastTier = props.tierStore.tiers[props.tierStore.tiers.length - 1]
    push('tiers', JSON.parse(JSON.stringify(lastTier)))
  }

  /**
   * Set gas type selected on gas price input
   * @param value
   */
  const updateGasTypeSelected = value => {
    const { updateGasTypeSelected } = props
    updateGasTypeSelected(value)
  }

  const handleValidateGasPrice = value => {
    const errors = composeValidators(
      isDecimalPlacesNotGreaterThan(VALIDATION_MESSAGES.DECIMAL_PLACES_9)(9),
      isGreaterOrEqualThan(VALIDATION_MESSAGES.NUMBER_GREATER_OR_EQUAL_THAN)(0.1)
    )(value.price)
    if (errors) return errors.shift()
  }

  const setFieldAsTouched = ({ values, errors }) => {
    if (reload) {
      const tiers = values && values.tiers ? values.tiers : []
      tiers.forEach((tier, index) => {
        form.mutators.setFieldTouched(`tiers[${index}].tier`, true)
        form.mutators.setFieldTouched(`tiers[${index}].updatable`, true)
        form.mutators.setFieldTouched(`tiers[${index}].whitelistEnabled`, true)
        form.mutators.setFieldTouched(`tiers[${index}].startTime`, true)
        form.mutators.setFieldTouched(`tiers[${index}].rate`, true)
        form.mutators.setFieldTouched(`tiers[${index}].endTime`, true)
        form.mutators.setFieldTouched(`tiers[${index}].minRate`, true)
        form.mutators.setFieldTouched(`tiers[${index}].maxRate`, true)
        form.mutators.setFieldTouched(`tiers[${index}].supply`, true)
        form.mutators.setFieldTouched(`tiers[${index}].minCap`, true)
      })
      form.mutators.setFieldTouched(`gasPrice`, true)
    }
  }

  const handleOnChange = ({ values }) => {
    props.tierStore.updateWalletAddress(values.walletAddress, VALID)
    props.generalStore.setGasPrice(gweiToWei(values.gasPrice.price))

    let totalSupply = 0

    values.tiers.forEach((tier, index) => {
      totalSupply += Number(tier.supply)
      props.tierStore.setTierProperty(tier.tier, 'tier', index)
      props.tierStore.setTierProperty(tier.minCap, 'minCap', index)
      props.tierStore.setTierProperty(tier.updatable, 'updatable', index)
      props.tierStore.setTierProperty(tier.startTime, 'startTime', index)
      props.tierStore.setTierProperty(tier.endTime, 'endTime', index)
      props.tierStore.updateRate(tier.rate, VALID, index)
      props.tierStore.setTierProperty(tier.supply, 'supply', index)
      props.tierStore.setTierProperty(tier.whitelistEnabled, 'whitelistEnabled', index)
      props.tierStore.validateTiers('supply', index)
    })
    const endTime =
      values && values.tiers && values.tiers.length > 0 ? values.tiers[values.tiers.length - 1].endTime : null
    props.crowdsaleStore.setProperty('supply', totalSupply)
    props.crowdsaleStore.setProperty('endTime', endTime)

    // Set fields as touched
    setFieldAsTouched({ values, errors })
  }

  const whenWhitelistBlock = tierInd => {
    return (
      <WhenFieldChanges
        key={`whenWhitelistBlock_${tierInd}`}
        field={`tiers[${tierInd}].whitelistEnabled`}
        becomes={'yes'}
        set={`tiers[${tierInd}].minCap`}
        to={0}
      />
    )
  }

  const whenWhitelistsChanges = () => {
    return (
      <div>
        {values.tiers.map((tier, ind) => {
          return whenWhitelistBlock(ind)
        })}
      </div>
    )
  }

  const navigateTo = (location, params = '') => {
    const path =
      {
        home: '/',
        stepOne: '1',
        manage: 'manage'
      }[location] || null

    if (path === null) {
      throw new Error(`invalid location specified: ${location}`)
    }

    // history.push(`${path}${params}`)
  }

  const goBack = async () => {
    navigateTo('stepOne')
  }

  return (
    <form onSubmit={handleSubmit} className="st-StepContent_FormFullHeight">
      {whenWhitelistsChanges()}
      <h2 className="sw-BorderedBlockTitle">Global settings</h2>
      <div className="sw-BorderedBlock">
        <Field
          name="walletAddress"
          component={InputField2}
          validate={isAddress()}
          errorStyle={inputErrorStyle}
          value={values.walletAddress}
          side="left"
          label={WALLET_ADDRESS}
          description={DESCRIPTION.WALLET}
        />
        <Field
          name="gasPrice"
          component={GasPriceInput}
          side="right"
          gasPrices={props.gasPricesInGwei}
          updateGasTypeSelected={updateGasTypeSelected}
          validate={value => handleValidateGasPrice(value)}
        />
      </div>
      <div className="sw-BorderedBlock">
        <FieldArray name="tiers">
          {({ fields }) => <TierBlock fields={fields} decimals={props.decimals} tierStore={props.tierStore} />}
        </FieldArray>
      </div>
      <div className="button button_fill_secondary" onClick={addTier}>
        Add Tier
      </div>
      <div className="st-StepContent_Buttons">
        <ButtonBack onClick={goBack} />
        <ButtonContinue onClick={handleSubmit} status={status} />
      </div>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
    </form>
  )
}
