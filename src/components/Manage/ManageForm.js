import React from 'react'
import { ButtonDownload } from '../Common/ButtonDownload'
import { Button } from '../Common/Button'
import { FieldArray } from 'react-final-form-arrays'
import { FormSpy, Field } from 'react-final-form'
import { InputField } from '../Common/InputField'
import { InputField2 } from '../Common/InputField2'
import { ManageDutchAuctionBlock } from './ManageDutchAuctionBlock'
import { ManageTierBlock } from './ManageTierBlock'
import { TEXT_FIELDS } from '../../utils/constants'
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
      canDownloadContractFiles,
      canEditMinCap,
      canSave,
      crowdsalePointer,
      crowdsaleStore,
      displaySave,
      downloadCrowdsaleFiles,
      generalStore,
      handleChange,
      handleSubmit,
      invalid,
      pristine,
      submitting,
      tokenStore,
      ...props
    }) => {
      const { tiers } = props.initialValues
      const { ticker, name, decimals } = tokenStore

      if (!tiers[0]) return null

      const minimum_supply = tiers.reduce((min, tier) => (tier.supply < min ? tier.supply : min), Infinity)
      const disabled = invalid || !canSave

      return (
        <form className="mng-ManageForm" onSubmit={handleSubmit}>
          <h2 className="mng-ManageForm_Title">
            {name} <span className="mng-ManageForm_Title-uppercase">({ticker})</span> Settings
          </h2>
          <div className="mng-ManageForm_BorderedBlock">
            <div className="mng-ManageForm_ItemsContainer">
              <div className="mng-ManageForm_Item">
                <InputField
                  disabled={true}
                  name="walletAddress"
                  readOnly={true}
                  title={TEXT_FIELDS.WALLET_ADDRESS}
                  type="text"
                  value={tiers[0].walletAddress}
                />
              </div>
              {crowdsaleStore.isDutchAuction ? (
                <div className="mng-ManageForm_Item">
                  <Field
                    component={InputField2}
                    disabled={!canEditMinCap}
                    label={TEXT_FIELDS.MIN_CAP}
                    name={tiers[0].minCap}
                    readOnly={true}
                    type="number"
                    validate={composeValidators(
                      isNonNegative(),
                      isDecimalPlacesNotGreaterThan()(decimals),
                      isLessOrEqualThan(`Should be less than or equal to ${minimum_supply}`)(minimum_supply)
                    )}
                    value={props.initialValues.minCap}
                  />
                </div>
              ) : null}
              {crowdsaleStore.isDutchAuction ? (
                <div className="mng-ManageForm_Item">
                  <InputField
                    disabled={true}
                    readOnly={true}
                    title={TEXT_FIELDS.BURN_EXCESS}
                    type="text"
                    value={crowdsaleStore.selected.burn_excess}
                  />
                </div>
              ) : null}
            </div>
            {crowdsaleStore.isDutchAuction ? (
              <FieldArray name="tiers">
                {({ fields }) => <ManageDutchAuctionBlock fields={fields} {...props} />}
              </FieldArray>
            ) : null}
            {crowdsaleStore.isMintedCappedCrowdsale ? (
              <FieldArray name="tiers">{({ fields }) => <ManageTierBlock fields={fields} {...props} />}</FieldArray>
            ) : null}
            <FormSpy subscription={{ values: true }} onChange={handleChange} />
            {canDownloadContractFiles || displaySave ? (
              <div className="mng-ManageForm_ButtonsContainer">
                {canDownloadContractFiles ? <ButtonDownload onClick={downloadCrowdsaleFiles} /> : null}
                {displaySave ? <Button type="submit" disabled={disabled} buttonText="Save" /> : null}
              </div>
            ) : null}
          </div>
        </form>
      )
    }
  )
)
