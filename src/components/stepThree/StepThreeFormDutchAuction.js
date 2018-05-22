import React from 'react'
import { Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { WhenFieldChanges } from '../Common/WhenFieldChanges'
import { InputField2 } from '../Common/InputField2'
import GasPriceInput from './GasPriceInput'
import { gweiToWei } from '../../utils/utils'
import classnames from 'classnames'
import {
  composeValidators,
  isAddress,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan,
  isNonNegative
} from '../../utils/validations'
import { TEXT_FIELDS, VALIDATION_TYPES, VALIDATION_MESSAGES, DESCRIPTION, NAVIGATION_STEPS } from '../../utils/constants'
import { DutchAuctionBlock } from '../Common/DutchAuctionBlock'

const { CROWDSALE_SETUP } = NAVIGATION_STEPS;
const { VALID } = VALIDATION_TYPES
const { MIN_CAP, WALLET_ADDRESS, ENABLE_WHITELISTING } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const StepThreeFormDutchAuction = ({ handleSubmit, values, invalid, pristine, mutators: { push }, ...props }) => {
  const submitButtonClass = classnames('button', 'button_fill', {
    button_disabled: pristine || invalid
  })

  const handleOnChange = ({ values }) => {
    props.tierStore.updateWalletAddress(values.walletAddress, VALID)
    props.generalStore.setGasPrice(gweiToWei(values.gasPrice.price))
    props.tierStore.setGlobalMinCap(values.minCap || 0)
    props.tierStore.setTierProperty(values.whitelistEnabled, "whitelistEnabled", 0)

    let totalSupply = 0

    values.tiers.forEach((tier, index) => {
      totalSupply += Number(tier.supply)
      props.tierStore.setTierProperty(tier.startTime, 'startTime', index)
      props.tierStore.setTierProperty(tier.endTime, 'endTime', index)
      props.tierStore.updateMinRate(tier.minRate, VALID, index)
      props.tierStore.updateMaxRate(tier.maxRate, VALID, index)
      props.tierStore.setTierProperty(tier.supply, 'supply', index)
      props.tierStore.validateTiers('supply', index)
    })
    props.crowdsaleStore.setProperty('supply', totalSupply)
    props.crowdsaleStore.setProperty('endTime', values.tiers[values.tiers.length - 1].endTime)
  }

  return (
    <form onSubmit={handleSubmit}>
      <WhenFieldChanges
        field="whitelistEnabled"
        becomes={'yes'}
        set="minCap"
        to={0}
      />
      <div>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-setup"/>
            <p className="title">{CROWDSALE_SETUP}</p>
            <p className="description">{DESCRIPTION.CROWDSALE_SETUP}</p>
          </div>
          <div className="section-title">
            <p className="title">Global settings</p>
          </div>
          <div className="input-block-container">
            <Field
              name="walletAddress"
              component={InputField2}
              validate={isAddress()}
              errorStyle={inputErrorStyle}
              side="left"
              label={WALLET_ADDRESS}
              description={DESCRIPTION.WALLET}
            />
            <Field
              name="gasPrice"
              component={GasPriceInput}
              side="right"
              gasPrices={props.gasPricesInGwei}
              validate={(value) => composeValidators(
                isDecimalPlacesNotGreaterThan(VALIDATION_MESSAGES.DECIMAL_PLACES_9)(9),
                isGreaterOrEqualThan(VALIDATION_MESSAGES.NUMBER_GREATER_THAN)(0.1)
              )(value.price)}
            />
          </div>
          <div className="input-block-container">
            <Field
              name="minCap"
              component={InputField2}
              validate={composeValidators(
                isNonNegative(),
                isDecimalPlacesNotGreaterThan()(props.decimals)
              )}
              disabled={values.whitelistEnabled === 'yes'}
              errorStyle={inputErrorStyle}
              type="number"
              side="left"
              label={MIN_CAP}
              description={DESCRIPTION.MIN_CAP}
            />
            <Field
              name="whitelistEnabled"
              render={({ input }) => (
                <div className='right'>
                  <label className="label">{ENABLE_WHITELISTING}</label>
                  <div className='radios-inline'>
                    <label className='radio-inline'>
                      <input
                        type='radio'
                        checked={input.value === 'yes'}
                        value='yes'
                        onChange={() => input.onChange('yes')}
                      />
                      <span className='title'>yes</span>
                    </label>
                    <label className='radio-inline'>
                      <input
                        type='radio'
                        checked={input.value === 'no'}
                        value='no'
                        onChange={() => input.onChange('no')}
                      />
                      <span className='title'>no</span>
                    </label>
                  </div>
                  <p className='description'>{DESCRIPTION.ENABLE_WHITELIST}</p>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <FieldArray name="tiers">
        {({ fields }) => (
          <DutchAuctionBlock fields={fields} decimals={props.decimals}/>
        )}
      </FieldArray>

      <div className="button-container">
        <span onClick={handleSubmit} className={submitButtonClass}>Continue</span>
      </div>

      <FormSpy subscription={{ values: true }} onChange={handleOnChange}/>
    </form>
  )
}
