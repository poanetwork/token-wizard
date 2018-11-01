import GasPriceInput from './GasPriceInput'
import React from 'react'
import logdown from 'logdown'
import { ButtonBack } from '../Common/ButtonBack'
import { ButtonContinue } from '../Common/ButtonContinue'
import { DutchAuctionBlock } from '../Common/DutchAuctionBlock'
import { Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { InputField2 } from '../Common/InputField2'
import { DESCRIPTION, TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import { WhenFieldChanges } from '../Common/WhenFieldChanges'
import {
  composeValidators,
  isAddress,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan
} from '../../utils/validations'
import { gweiToWei, navigateTo, toBigNumber } from '../../utils/utils'
import { RadioButton } from '../Common/RadioButton'

const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS, BURN_EXCESS } = TEXT_FIELDS
const logger = logdown('TW:StepThree')

export const StepThreeFormDutchAuction = ({
  errors,
  form,
  handleSubmit,
  history,
  invalid,
  pristine,
  firstLoad,
  submitting,
  values,
  ...props
}) => {
  const { setFieldTouched } = form.mutators

  const handleValidateGasPrice = value => {
    const errors = composeValidators(
      isDecimalPlacesNotGreaterThan(VALIDATION_MESSAGES.DECIMAL_PLACES_9)(9),
      isGreaterOrEqualThan(VALIDATION_MESSAGES.NUMBER_GREATER_OR_EQUAL_THAN)(0.1)
    )(value.price)
    if (errors) return errors.shift()
  }

  const handleBurnExcessChange = (value, input) => {
    const { generalStore } = props
    generalStore.setBurnExcess(value)
    input.onChange(value)
  }

  const setFieldAsTouched = ({ values }) => {
    if (firstLoad) {
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
    const { walletAddress, gasPrice, burnExcess, tiers } = values

    tierStore.updateWalletAddress(walletAddress, VALID)
    tierStore.updateBurnExcess(burnExcess, VALID)

    tiers.forEach((tier, index) => {
      tierStore.setTierProperty(tier.minCap, 'minCap', index)
      tierStore.setTierProperty(tier.startTime, 'startTime', index)
      tierStore.setTierProperty(tier.endTime, 'endTime', index)
      tierStore.updateMinRate(tier.minRate, VALID, index)
      tierStore.updateMaxRate(tier.maxRate, VALID, index)
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

  const getBurnExcessButtons = (name, input) => {
    const buttons = [
      {
        checked: input.value === 'yes',
        id: `${name}.enable_whitelisting_yes`,
        label: 'Yes',
        name: name,
        onChange: e => handleBurnExcessChange(e.target.value, input),
        value: 'yes'
      },
      {
        checked: input.value === 'no',
        id: `${name}.enable_whitelisting_no`,
        label: 'No',
        name: name,
        onChange: e => handleBurnExcessChange(e.target.value, input),
        value: 'no'
      }
    ]

    return buttons
  }

  return (
    <form onSubmit={handleSubmit} className="st-StepContent_FormFullHeight">
      <WhenFieldChanges field="tiers[0].whitelistEnabled" becomes={'yes'} set="tiers[0].minCap" to={0} />
      <h2 className="sw-BorderedBlockTitle">Global settings</h2>
      <div tabIndex="0" className="sw-BorderedBlock sw-BorderedBlock-CrowdSaleSetupGlobalSettingsDutchAuction">
        <Field
          component={InputField2}
          description={DESCRIPTION.WALLET}
          label={WALLET_ADDRESS}
          name="walletAddress"
          placeholder="Enter here"
          validate={isAddress()}
          value={values.walletAddress}
          extraClassName="sw-InputField2-DutchAuctionWalletAddress"
        />
        <Field
          component={GasPriceInput}
          gasPrices={props.gasPriceStore.gasPricesInGwei}
          name="gasPrice"
          updateGasTypeSelected={value => props.updateGasTypeSelected(value)}
          validate={value => handleValidateGasPrice(value)}
          id="gasPrice"
          side="right"
          extraClassName="sw-GasPriceInput-DutchAuction"
        />
        <Field
          name="burnExcess"
          render={({ input }) => (
            <RadioButton
              buttons={getBurnExcessButtons(`burnExcessRadioButtons`, input)}
              description={DESCRIPTION.BURN_EXCESS}
              extraClassName="sw-RadioButton-DutchAuctionBurnExcess"
              title={BURN_EXCESS}
            />
          )}
        />
        <FieldArray name="tiers">
          {({ fields }) => (
            <DutchAuctionBlock
              fields={fields}
              decimals={props.tokenStore.decimals}
              tierStore={props.tierStore}
              tokenStore={props.tokenStore}
            />
          )}
        </FieldArray>
      </div>
      <div className="st-StepContent_Buttons">
        <ButtonBack onClick={goBack} />
        <ButtonContinue onClick={handleSubmit} status={!submitting && !invalid} />
      </div>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
    </form>
  )
}
