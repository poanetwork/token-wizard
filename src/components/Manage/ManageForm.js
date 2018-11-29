import React from 'react'
import { ButtonDownload } from '../Common/ButtonDownload'
import { Button } from '../Common/Button'
import { FieldArray } from 'react-final-form-arrays'
import { FormSpy } from 'react-final-form'
import { InputField } from '../Common/InputField'
import { ManageDutchAuctionBlock } from './ManageDutchAuctionBlock'
import { ManageTierBlock } from './ManageTierBlock'
import { TEXT_FIELDS } from '../../utils/constants'
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
      const { ticker, name } = tokenStore

      if (!tiers[0]) return null

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
                  name="crowdsaleType"
                  readOnly={true}
                  title={TEXT_FIELDS.STRATEGY}
                  type="text"
                  value={crowdsaleStore.isDutchAuction ? 'Dutch Auction' : 'Whitelist With Cap'}
                />
              </div>
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
