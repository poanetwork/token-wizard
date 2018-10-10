import GasPriceInput from './GasPriceInput'
import React from 'react'
import logdown from 'logdown'
import { ButtonBack } from '../Common/ButtonBack'
import { ButtonContinue } from '../Common/ButtonContinue'
import { DutchAuctionBlock } from '../Common/DutchAuctionBlock'
import { Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { InputField2 } from '../Common/InputField2'
import {
  DESCRIPTION,
  NAVIGATION_STEPS,
  TEXT_FIELDS,
  VALIDATION_MESSAGES,
  VALIDATION_TYPES
} from '../../utils/constants'
import { WhenFieldChanges } from '../Common/WhenFieldChanges'
import {
  composeValidators,
  isAddress,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan
} from '../../utils/validations'
import { gweiToWei, navigateTo } from '../../utils/utils'
import { RadioButton } from '../Common/RadioButton'

const logger = logdown('TW:StepThree')
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS, BURN_EXCESS } = TEXT_FIELDS

export const StepThreeFormDutchAuction = ({
  form,
  handleSubmit,
  history,
  invalid,
  pristine,
  reload,
  submitting,
  ...props
}) => {
  const status = !(submitting || invalid)

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

  const handleBurnExcessChange = (value, input) => {
    const { generalStore } = props
    generalStore.setBurnExcess(value)
    input.onChange(value)
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

  const handleOnChange = ({ values, errors }) => {
    props.tierStore.updateWalletAddress(values.walletAddress, VALID)
    props.tierStore.updateBurnExcess(values.burnExcess, VALID)
    props.generalStore.setGasPrice(gweiToWei(values.gasPrice.price))

    let totalSupply = 0

    const tiers = values && values.tiers ? values.tiers : []
    tiers.forEach((tier, index) => {
      totalSupply += Number(tier.supply)
      props.tierStore.setTierProperty(tier.minCap, 'minCap', index)
      props.tierStore.setTierProperty(tier.startTime, 'startTime', index)
      props.tierStore.setTierProperty(tier.endTime, 'endTime', index)
      props.tierStore.updateMinRate(tier.minRate, VALID, index)
      props.tierStore.updateMaxRate(tier.maxRate, VALID, index)
      props.tierStore.setTierProperty(tier.supply, 'supply', index)
      props.tierStore.setTierProperty(tier.whitelistEnabled, 'whitelistEnabled', index)
      props.tierStore.validateTiers('supply', index)
    })

    const endTime = tiers.length > 0 ? tiers[tiers.length - 1].endTime : null

    props.crowdsaleStore.setProperty('supply', totalSupply)
    props.crowdsaleStore.setProperty('endTime', endTime)

    // Set fields as touched
    setFieldAsTouched({ values, errors })
  }

  const goBack = async () => {
    try {
      navigateTo(history, 'stepTwo')
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
      <div tabIndex="0" className="sw-BorderedBlock sw-BorderedBlock-3Rows2Columns">
        <Field
          component={InputField2}
          description={DESCRIPTION.WALLET}
          extraClassName="sw-InputField2-DutchAuctionWalletAddress"
          label={WALLET_ADDRESS}
          name="walletAddress"
          validate={isAddress()}
        />
        <Field
          component={GasPriceInput}
          extraClassName="sw-GasPriceInput-DutchAuction"
          gasPrices={props.gasPricesInGwei}
          id="gasPrice"
          name="gasPrice"
          side="right"
          updateGasTypeSelected={updateGasTypeSelected}
          validate={value => handleValidateGasPrice(value)}
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
          {({ fields }) => <DutchAuctionBlock fields={fields} decimals={props.decimals} />}
        </FieldArray>
      </div>
      <div className="st-StepContent_Buttons">
        <ButtonBack onClick={goBack} />
        <ButtonContinue onClick={handleSubmit} status={status} />
      </div>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
    </form>
  )
}
