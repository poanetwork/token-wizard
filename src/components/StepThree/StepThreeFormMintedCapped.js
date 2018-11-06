import GasPriceInput from './GasPriceInput'
import React from 'react'
import AddTierButton from './AddTierButton'
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
import { gweiToWei, navigateTo, toBigNumber } from '../../utils/utils'

const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS } = TEXT_FIELDS

export const StepThreeFormMintedCapped = ({
  errors,
  form,
  handleSubmit,
  history,
  invalid,
  pristine,
  firstLoad,
  submitting,
  values,
  goBack,
  goBackEnabled,
  ...props
}) => {
  const { push, setFieldTouched } = form.mutators

  const addTier = () => {
    const { tierStore } = props
    tierStore.addCrowdsale()
    const lastTier = tierStore.tiers.slice()[tierStore.tiers.length - 1]
    push('tiers', lastTier)
  }

  const handleValidateGasPrice = value => {
    const hasErrors = composeValidators(
      isDecimalPlacesNotGreaterThan(VALIDATION_MESSAGES.DECIMAL_PLACES_9)(9),
      isGreaterOrEqualThan(`${VALIDATION_MESSAGES.NUMBER_GREATER_OR_EQUAL_THAN} 0.1`)(0.1)
    )(value.price)
    if (hasErrors) return hasErrors.shift()
  }

  const setFieldAsTouched = ({ values }) => {
    if (!firstLoad) {
      values.tiers.forEach((tier, index) => {
        setFieldTouched(`tiers[${index}].tier`, true)
        setFieldTouched(`tiers[${index}].updatable`, true)
        setFieldTouched(`tiers[${index}].whitelistEnabled`, true)
        setFieldTouched(`tiers[${index}].startTime`, true)
        setFieldTouched(`tiers[${index}].rate`, true)
        setFieldTouched(`tiers[${index}].endTime`, true)
        setFieldTouched(`tiers[${index}].minRate`, true)
        setFieldTouched(`tiers[${index}].maxRate`, true)
        setFieldTouched(`tiers[${index}].supply`, true)
        setFieldTouched(`tiers[${index}].minCap`, true)
      })
      setFieldTouched(`gasPrice`, true)
    }
  }

  const handleOnChange = ({ values }) => {
    const { tierStore, generalStore, crowdsaleStore } = props
    const { walletAddress, gasPrice, tiers } = values

    tierStore.updateWalletAddress(walletAddress, VALID)

    tiers.forEach((tier, index) => {
      tierStore.setTierProperty(tier.tier, 'tier', index)
      tierStore.setTierProperty(tier.minCap, 'minCap', index)
      tierStore.setTierProperty(tier.updatable, 'updatable', index)
      tierStore.setTierProperty(tier.startTime, 'startTime', index)
      tierStore.setTierProperty(tier.endTime, 'endTime', index)
      tierStore.updateRate(tier.rate, VALID, index)
      tierStore.setTierProperty(tier.supply, 'supply', index)
      tierStore.setTierProperty(tier.whitelistEnabled, 'whitelistEnabled', index)
      tierStore.validateTiers('supply', index)
    })

    const totalSupply = tiers.reduce((acc, { supply }) => acc.plus(toBigNumber(supply)), toBigNumber(0)).toFixed()
    crowdsaleStore.setProperty('supply', totalSupply)

    const endTime = tiers.length > 0 ? tiers[tiers.length - 1].endTime : null
    crowdsaleStore.setProperty('endTime', endTime)

    generalStore.setGasPrice(gweiToWei(gasPrice.price))

    // Set fields as touched
    setFieldAsTouched({ values })
  }

  const WhenWhitelistsChange = (
    <div>
      {values.tiers.map((tier, index) => (
        <WhenFieldChanges
          becomes={'yes'}
          field={`tiers[${index}].whitelistEnabled`}
          key={`whenWhitelistBlock_${index}`}
          set={`tiers[${index}].minCap`}
          to={0}
        />
      ))}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="st-StepContent_FormFullHeight">
      {WhenWhitelistsChange}
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
          gasPrices={props.gasPriceStore.gasPricesInGwei}
          name="gasPrice"
          updateGasTypeSelected={value => props.generalStore.setGasTypeSelected(value)}
          validate={value => handleValidateGasPrice(value)}
        />
      </div>
      <FieldArray name="tiers">
        {({ fields }) => (
          <TierBlock form={form} fields={fields} decimals={props.tokenStore.decimals} tierStore={props.tierStore} />
        )}
      </FieldArray>
      <AddTierButton onClick={addTier} />
      <div className="st-StepContent_Buttons">
        <ButtonBack onClick={goBack} disabled={!goBackEnabled} />
        <ButtonContinue type="submit" disabled={submitting || invalid} />
      </div>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
    </form>
  )
}
