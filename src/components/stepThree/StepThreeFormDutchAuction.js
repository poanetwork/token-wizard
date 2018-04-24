import React from 'react'
import { Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { InputField2 } from '../Common/InputField2'
import GasPriceInput from './GasPriceInput'
import { gweiToWei } from '../../utils/utils'
import classnames from 'classnames'
import {
  composeValidators,
  isAddress,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan
} from '../../utils/validations'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import { DutchAuctionBlock } from '../Common/DutchAuctionBlock'

const { VALID } = VALIDATION_TYPES
const { WALLET_ADDRESS } = TEXT_FIELDS

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

    values.tiers.forEach((tier, index) => {
      props.tierStore.setTierProperty(tier.startTime, 'startTime', index)
      props.tierStore.setTierProperty(tier.endTime, 'endTime', index)
      props.tierStore.updateMinRate(tier.minRate, VALID, index)
      props.tierStore.updateMaxRate(tier.maxRate, VALID, index)
      props.tierStore.setTierProperty(tier.supply, 'supply', index)
      props.tierStore.validateTiers('supply', index)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
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
        </div>
      </div>

      <FieldArray name="tiers">
        {({ fields }) => (
          <DutchAuctionBlock
            fields={fields}
            decimals={props.decimals}
            tierStore={props.tierStore}
          />
        )}
      </FieldArray>

      <div className="button-container">
        <span onClick={handleSubmit} className={submitButtonClass}>Continue</span>
      </div>

      <FormSpy subscription={{ values: true }} onChange={handleOnChange}/>
    </form>
  )
}
