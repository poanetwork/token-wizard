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
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { InputField2 } from '../Common/InputField2'
import { Field } from 'react-final-form'

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px'
}
const { CROWDSALE_SETUP_NAME } = TEXT_FIELDS
const dateToTimestamp = date => new Date(date).getTime()

export const ManageTierBlock = inject('crowdsaleStore', 'tokenStore')(
  observer(({ fields, canEditTiers, crowdsaleStore, tokenStore, aboutTier, ...props }) => (
    <div>
      {fields.map((name, index) => {
        const currentTier = fields.value[index]
        const { tier } = currentTier
        const {
          startTime: initialStartTime,
          endTime: initialEndTime,
          whitelistEnabled,
          updatable,
          supply
        } = fields.initial[index]

        const tierHasStarted = !isDateLaterThan()(dateToTimestamp(initialStartTime))(Date.now())
        const tierHasEnded = !isDateLaterThan()(dateToTimestamp(initialEndTime))(Date.now())
        const canEditDuration = canEditTiers && updatable && !tierHasEnded && !tierHasStarted
        const canEditWhiteList = canEditTiers && !tierHasEnded
        const isWhitelistEnabled = whitelistEnabled === 'yes'
        const canEditMinCap = !isWhitelistEnabled && canEditTiers && updatable && !tierHasEnded

        return (
          <div className="steps" key={index}>
            <div className="steps-content container">
              <div className={classNames('hidden', { divisor: isWhitelistEnabled })}>
                <div className="input-block-container">
                  <InputField side="left" type="text" title={CROWDSALE_SETUP_NAME} value={tier} disabled={true} />
                </div>

                <div className="input-block-container">
                  <CrowdsaleStartTime
                    name={`${name}.startTime`}
                    index={index}
                    disabled={true}
                    side="left"
                    errorStyle={inputErrorStyle}
                  />
                  <CrowdsaleEndTime
                    name={`${name}.endTime`}
                    index={index}
                    disabled={!canEditDuration}
                    side="right"
                    errorStyle={inputErrorStyle}
                  />
                </div>

                <div className="input-block-container">
                  <CrowdsaleRate name={`${name}.rate`} side="left" disabled={true} errorStyle={inputErrorStyle} />
                  <Supply name={`${name}.supply`} side="right" disabled={true} errorStyle={inputErrorStyle} />
                </div>

                <div className="input-block-container">
                  <Field
                    name={`${name}.minCap`}
                    component={InputField2}
                    validate={composeValidators(
                      isNonNegative(),
                      isDecimalPlacesNotGreaterThan()(tokenStore.decimals),
                      isLessOrEqualThan(`Should be less than or equal to ${supply}`)(supply)
                    )}
                    disabled={!canEditMinCap}
                    errorStyle={inputErrorStyle}
                    type="number"
                    side="left"
                    label={TEXT_FIELDS.MIN_CAP}
                  />
                </div>
              </div>
              {isWhitelistEnabled ? (
                <div>
                  <div className="section-title">
                    <p className="title">Whitelist</p>
                  </div>
                  {canEditWhiteList ? (
                    <WhitelistInputBlock key={index.toString()} num={index} decimals={tokenStore.decimals} />
                  ) : (
                    <ReadOnlyWhitelistAddresses tier={currentTier} />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  ))
)
