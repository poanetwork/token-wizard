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
  isLessOrEqualThan,
  isNonNegative,
} from '../../utils/validations'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import { TierBlock } from '../Common/TierBlock'

const { VALID } = VALIDATION_TYPES
const { MINCAP, WALLET_ADDRESS } = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const StepThreeForm = ({ handleSubmit, values, invalid, pristine, mutators: { push }, ...props }) => {
  const submitButtonClass = classnames('button', 'button_fill', {
    button_disabled: pristine || invalid
  })

  const addTier = () => {
    props.addCrowdsale()
    const lastTier = props.tierStore.tiers[props.tierStore.tiers.length - 1]
    push('tiers', JSON.parse(JSON.stringify(lastTier)))
  }

  const handleOnChange = ({ values }) => {
    props.tierStore.updateWalletAddress(values.walletAddress, VALID)
    props.generalStore.setGasPrice(gweiToWei(values.gasPrice.price))
    props.tierStore.setGlobalMinCap(values.minCap || 0)
    props.tierStore.setTierProperty(values.whitelistEnabled, "whitelistEnabled", 0)

    values.tiers.forEach((tier, index) => {
      props.tierStore.setTierProperty(tier.tier, 'tier', index)
      props.tierStore.setTierProperty(tier.updatable, 'updatable', index)
      props.tierStore.setTierProperty(tier.startTime, 'startTime', index)
      props.tierStore.setTierProperty(tier.endTime, 'endTime', index)
      props.tierStore.updateRate(tier.rate, VALID, index)
      props.tierStore.setTierProperty(tier.supply, 'supply', index)
      props.tierStore.validateTiers('supply', index)
    })
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
            <p className="title">Crowdsale setup</p>
            <p className="description">The most important and exciting part of the crowdsale process. Here you can
              define parameters of your crowdsale campaign.</p>
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
              description="Where the money goes after investors transactions. Immediately after each transaction. We
                        recommend to setup a multisig wallet with hardware based signers."
            />

            <Field
              name="gasPrice"
              component={GasPriceInput}
              side="right"
              gasPrices={props.gasPricesInGwei}
              validate={(value) => composeValidators(
                isDecimalPlacesNotGreaterThan("Should not have more than 9 decimals")(9),
                isGreaterOrEqualThan("Should be greater than 0.1")(0.1)
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
              label={MINCAP}
              description="Minimum amount of tokens to buy. Not the minimal amount for every transaction: if minCap is 1
               and a user already has 1 token from a previous transaction, they can buy any amount they want."
            />
            <Field
              name="whitelistEnabled"
              render={({ input }) => (
                <div className='right'>
                  <label className="label">Enable whitelisting</label>
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
                  <p className='description'>Enables whitelisting. If disabled, anyone can participate in the
                    crowdsale.</p>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <FieldArray name="tiers">
        {({ fields }) => (
          <TierBlock
            fields={fields}
            minCap={values.minCap}
            decimals={props.decimals}
            tierStore={props.tierStore}
          />
        )}
      </FieldArray>

      <div className="button-container">
        <div className="button button_fill_secondary" onClick={addTier}>
          Add Tier
        </div>
        <span onClick={handleSubmit} className={submitButtonClass}>Continue</span>
      </div>

      <FormSpy subscription={{ values: true }} onChange={handleOnChange}/>
    </form>
  )
}
