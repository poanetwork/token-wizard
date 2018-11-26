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
      crowdsalePointer,
      downloadCrowdsaleFiles,
      canDownloadContractFiles,
      ...props
    }) => {
      const { tiers } = props.initialValues

      if (!tiers[0]) return null

      const minimum_supply = tiers.reduce((min, tier) => (tier.supply < min ? tier.supply : min), Infinity)

      // Build disable class to use in the submit button
      const disable = invalid || !canSave
      const submitButtonClass = classNames('no_arrow', 'button', 'button_fill', 'button_no_border', {
        button_disabled: disable
      })

      const saveButton = (
        <button type="submit" disabled={disable} className={submitButtonClass}>
          Save
        </button>
      )
      const downloadButton = (
        <button
          onClick={downloadCrowdsaleFiles}
          className="button button_fill_secondary button_no_border"
          type="button"
        >
          Download Files
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
          label={TEXT_FIELDS.MIN_CAP}
          type="number"
          value={props.initialValues.minCap}
        />
      )

      return (
        <form className="mng-ManageForm" onSubmit={handleSubmit}>
          <h2 className="mng-ManageForm_Title">My Token (MTK) Settings</h2>
          <div className="mng-ManageForm_BorderedBlock">
            <div className="mng-ManageForm_ItemsContainer">
              <div className="mng-ManageForm_Item">
                <InputField
                  disabled={true}
                  name="walletAddress"
                  title={TEXT_FIELDS.WALLET_ADDRESS}
                  type="text"
                  value={tiers[0].walletAddress}
                />
              </div>
              {/* TODO: check if this is working */}
              {crowdsaleStore.isDutchAuction ? <div className="mng-ManageForm_Item">{minCap}</div> : null}
              {crowdsaleStore.isDutchAuction ? (
                <div className="mng-ManageForm_Item">
                  <InputField
                    disabled={true}
                    title={TEXT_FIELDS.BURN_EXCESS}
                    type="text"
                    value={crowdsaleStore.selected.burn_excess}
                  />
                </div>
              ) : null}
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
          </div>
          <div className="button-container">
            {canDownloadContractFiles ? downloadButton : null}
            {displaySave ? saveButton : null}
          </div>
        </form>
      )
    }
  )
)
