import GasPriceInput from './GasPriceInput'
import React from 'react'
import logdown from 'logdown'
import { AddTierButton } from './AddTierButton'
import { ButtonBack } from '../Common/ButtonBack'
import { ButtonContinue } from '../Common/ButtonContinue'
import { Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { InputField2 } from '../Common/InputField2'
import { TEXT_FIELDS, VALIDATION_TYPES, VALIDATION_MESSAGES, DESCRIPTION } from '../../utils/constants'
import { TierBlock } from '../Common/TierBlock'
import { WhenFieldChanges } from '../Common/WhenFieldChanges'
import {
  composeValidators,
  isAddress,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan
} from '../../utils/validations'
import { gweiToWei, navigateTo } from '../../utils/utils'

const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS } = TEXT_FIELDS
const logger = logdown('TW:StepThree')

export const StepThreeFormMintedCapped = ({
  errors,
  form,
  handleSubmit,
  history,
  invalid,
  mutators: { push, setFieldTouched },
  pristine,
  reload,
  submitting,
  values,
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
        becomes={'yes'}
        field={`tiers[${tierInd}].whitelistEnabled`}
        key={`whenWhitelistBlock_${tierInd}`}
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

  const goBack = async () => {
    try {
      navigateTo({
        history: history,
        location: 'stepTwo'
      })
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="st-StepContent_FormFullHeight">
      {whenWhitelistsChanges()}
      <h2 className="sw-BorderedBlockTitle">Global settings</h2>
      <div tabIndex="0" className="sw-BorderedBlock sw-BorderedBlock-CrowdSaleSetupGlobalSettingsWhitelistCapped">
        <Field
          component={InputField2}
          description={DESCRIPTION.WALLET}
          label={WALLET_ADDRESS}
          name="walletAddress"
          placeholder="Enter here"
          validate={isAddress()}
          value={values.walletAddress}
        />
        <Field
          component={GasPriceInput}
          gasPrices={props.gasPricesInGwei}
          name="gasPrice"
          updateGasTypeSelected={updateGasTypeSelected}
          validate={value => handleValidateGasPrice(value)}
        />
      </div>
      <FieldArray name="tiers">
        {({ fields }) => (
          <TierBlock form={form} fields={fields} decimals={props.decimals} tierStore={props.tierStore} />
        )}
      </FieldArray>
      <AddTierButton onClick={addTier} />
      <div className="st-StepContent_Buttons">
        <ButtonBack onClick={goBack} />
        <ButtonContinue onClick={handleSubmit} status={status} />
      </div>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
    </form>
  )
}
