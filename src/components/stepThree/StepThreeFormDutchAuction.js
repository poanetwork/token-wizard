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
import { DutchAuctionBlock } from '../Common/DutchAuctionBlock'

const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS, BURN_EXCESS } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px'
}

export const StepThreeFormDutchAuction = ({ handleSubmit, invalid, submitting, pristine, ...props }) => {
  const status = !(submitting || invalid)

  /**
   * Set gas type selected on gas price input
   * @param value
   */
  const updateGasTypeSelected = value => {
    const { generalStore } = props
    generalStore.setGasTypeSelected(value)
  }

  const handleOnChange = ({ values }) => {
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
  }

  return (
    <form onSubmit={handleSubmit}>
      <WhenFieldChanges field="tiers[0].whitelistEnabled" becomes={'yes'} set="tiers[0].minCap" to={0} />
      <div>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-setup" />
            <p className="title">{CROWDSALE_SETUP}</p>
            <p className="description">{DESCRIPTION.CROWDSALE_SETUP}</p>
          </div>
          <div className="section-title">
            <p className="title">Global settings</p>
          </div>
          <div className="input-block-container">
            <div className="left">
              <div>
                <Field
                  name="walletAddress"
                  component={InputField2}
                  validate={isAddress()}
                  errorStyle={inputErrorStyle}
                  label={WALLET_ADDRESS}
                  description={DESCRIPTION.WALLET}
                />
              </div>
              <div>
                <Field
                  name="burnExcess"
                  render={({ input }) => (
                    <div>
                      <label className="label">{BURN_EXCESS}</label>
                      <div className="radios-inline">
                        <label className="radio-inline">
                          <input
                            type="radio"
                            checked={input.value === 'yes'}
                            value="yes"
                            onChange={() => input.onChange('yes')}
                          />
                          <span className="title">yes</span>
                        </label>
                        <label className="radio-inline">
                          <input
                            type="radio"
                            checked={input.value === 'no'}
                            value="no"
                            onChange={() => input.onChange('no')}
                          />
                          <span className="title">no</span>
                        </label>
                      </div>
                      <p className="description">{DESCRIPTION.BURN_EXCESS}</p>
                    </div>
                  )}
                />
              </div>
            </div>
            <Field
              name="gasPrice"
              component={GasPriceInput}
              side="right"
              gasPrices={props.gasPricesInGwei}
              updateGasTypeSelected={updateGasTypeSelected}
              validate={value =>
                composeValidators(
                  isDecimalPlacesNotGreaterThan(VALIDATION_MESSAGES.DECIMAL_PLACES_9)(9),
                  isGreaterOrEqualThan(VALIDATION_MESSAGES.NUMBER_GREATER_THAN)(0.1)
                )(value.price)
              }
            />
          </div>
        </div>
      </div>

      <FieldArray name="tiers">
        {({ fields }) => <DutchAuctionBlock fields={fields} decimals={props.decimals} />}
      </FieldArray>

      <div className="button-container">
        <ButtonContinue onClick={handleSubmit} status={status} />
      </div>

      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
    </form>
  )
}
