import React from 'react'
import { CrowdsaleStartTime } from './../Common/CrowdsaleStartTime'
import { CrowdsaleEndTime } from './../Common/CrowdsaleEndTime'
import { CrowdsaleRate } from './../Common/CrowdsaleRate'
import { Supply } from './../Common/Supply'
import { TEXT_FIELDS } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import {
  composeValidators,
  isDateLaterThan,
  isDecimalPlacesNotGreaterThan,
  isLessOrEqualThan,
  isNonNegative
} from '../../utils/validations'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { ReadOnlyWhitelistAddresses } from './ReadOnlyWhitelistAddresses'
import { inject, observer } from 'mobx-react'
import { InputField2 } from '../Common/InputField2'
import { Field } from 'react-final-form'

const { CROWDSALE_SETUP_NAME } = TEXT_FIELDS
const dateToTimestamp = date => new Date(date).getTime()

export const ManageTierBlock = inject('crowdsaleStore', 'tokenStore')(
  observer(({ fields, canEditTiers, crowdsaleStore, tokenStore, aboutTier, ...props }) => (
    <div>
      {fields.map((name, index) => {
        const currentTier = fields.value[index]
        const { tier } = currentTier
        let {
          startTime: initialStartTime,
          endTime: initialEndTime,
          whitelistEnabled,
          updatable,
          supply
        } = fields.initial[index]

        // initialStartTime and initialEndTime already converted to local timezone
        const tierHasStarted = !isDateLaterThan()(dateToTimestamp(initialStartTime))(Date.now())
        const tierHasEnded = !isDateLaterThan()(dateToTimestamp(initialEndTime))(Date.now())
        const canEditDuration = canEditTiers && updatable && !tierHasEnded && !tierHasStarted
        const canEditWhiteList = canEditTiers && !tierHasEnded
        const isWhitelistEnabled = whitelistEnabled === 'yes'
        const canEditMinCap = !isWhitelistEnabled && canEditTiers && updatable && !tierHasEnded

        return (
          <div className="mng-ManageTierBlock" key={index}>
            <div className="mng-ManageTierBlock_ItemsContainer">
              <div className="mng-ManageForm_Item">
                <InputField
                  disabled={true}
                  name={`${name}.crowdsale_name`}
                  title={CROWDSALE_SETUP_NAME}
                  type="text"
                  value={tier}
                />
              </div>
              <div className="mng-ManageForm_Item">
                <CrowdsaleStartTime disabled={true} index={index} name={`${name}.startTime`} />
              </div>
              <div className="mng-ManageForm_Item">
                <CrowdsaleEndTime name={`${name}.endTime`} index={index} disabled={!canEditDuration} />
              </div>
              <div className="mng-ManageForm_Item">
                <CrowdsaleRate name={`${name}.rate`} disabled={true} />
              </div>
              <div className="mng-ManageForm_Item">
                <Supply name={`${name}.supply`} disabled={true} />
              </div>
              <div className="mng-ManageForm_Item">
                <Field
                  name={`${name}.minCap`}
                  component={InputField2}
                  validate={composeValidators(
                    isNonNegative(),
                    isDecimalPlacesNotGreaterThan()(tokenStore.decimals),
                    isLessOrEqualThan(`Should be less than or equal to ${supply}`)(supply)
                  )}
                  disabled={!canEditMinCap}
                  type="number"
                  label={TEXT_FIELDS.MIN_CAP}
                />
              </div>
            </div>
            {/* TODO: title should be included in read only whitelist too */}
            {isWhitelistEnabled ? (
              canEditWhiteList ? (
                <WhitelistInputBlock key={index.toString()} num={index} decimals={tokenStore.decimals} />
              ) : (
                <ReadOnlyWhitelistAddresses tier={currentTier} />
              )
            ) : null}
          </div>
        )
      })}
    </div>
  ))
)
