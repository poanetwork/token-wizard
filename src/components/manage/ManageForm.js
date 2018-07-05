import React from 'react'
import { FormSpy, Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { ManageTierBlock } from './ManageTierBlock'
import { ManageDutchAuctionBlock } from './ManageDutchAuctionBlock'
import classNames from 'classnames'
import { InputField } from '../Common/InputField'
import { TEXT_FIELDS } from '../../utils/constants'
import { InputField2 } from '../Common/InputField2'
import {
  composeValidators,
  isDecimalPlacesNotGreaterThan,
  isLessOrEqualThan,
  isNonNegative
} from '../../utils/validations'
import { AboutCrowdsale } from './AboutCrowdsale'
import { inject, observer } from 'mobx-react'

export const ManageForm = inject('tokenStore', 'generalStore', 'crowdsaleStore')(
  observer(
    ({
      handleSubmit,
      invalid,
      pristine,
      submitting,
      handleChange,
      canSave,
      tokenStore,
      generalStore,
      crowdsaleStore,
      displaySave,
      canEditMinCap,
      ...props
    }) => {
      const { tiers } = props.initialValues

      if (!tiers[0]) return null

      const inputErrorStyle = {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '12px',
        width: '100%',
        height: '20px'
      }

      const minimum_supply = tiers.reduce((min, tier) => (tier.supply < min ? tier.supply : min), Infinity)

      // Build disable class to use in the submit button
      const submitButtonClass = classNames('no_arrow', 'button', 'button_fill', 'button_no_border', {
        button_disabled: submitting || pristine || invalid || !canSave
      })

      const saveButton = (
        <button type="submit" disabled={submitting || pristine || invalid} className={submitButtonClass}>
          Save
        </button>
      )

      const minCap = (
        <Field
          name="tiers[0].minCap"
          component={InputField2}
          validate={composeValidators(
            isNonNegative(),
            isDecimalPlacesNotGreaterThan()(tokenStore.decimals),
            isLessOrEqualThan(`Should be less than or equal to ${minimum_supply}`)(minimum_supply)
          )}
          disabled={!canEditMinCap}
          errorStyle={inputErrorStyle}
          type="number"
          side="left"
          label={TEXT_FIELDS.MIN_CAP}
          value={props.initialValues.minCap}
        />
      )

      return (
        <form onSubmit={handleSubmit}>
          <div className="steps">
            <div className="steps-content container">
              <AboutCrowdsale
                name={tokenStore.name}
                ticker={tokenStore.ticker}
                execID={crowdsaleStore.execID}
                networkID={generalStore.networkID}
              />
              {props.aboutTier}
              <div className="input-block-container">
                {crowdsaleStore.isDutchAuction ? minCap : null}
                <InputField
                  side={crowdsaleStore.isDutchAuction ? 'right' : 'left'}
                  type="text"
                  title={TEXT_FIELDS.WALLET_ADDRESS}
                  value={tiers[0].walletAddress}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <FieldArray name="tiers">
            {({ fields }) =>
              crowdsaleStore.isMintedCappedCrowdsale ? (
                <ManageTierBlock fields={fields} {...props} />
              ) : (
                <ManageDutchAuctionBlock fields={fields} {...props} />
              )
            }
          </FieldArray>
          <FormSpy subscription={{ values: true }} onChange={handleChange} />

          <div className="steps">
            <div className="button-container">{displaySave ? saveButton : null}</div>
          </div>
        </form>
      )
    }
  )
)
