import React from 'react'
import { CrowdsaleStartTime } from './../Common/CrowdsaleStartTime'
import { CrowdsaleEndTime } from './../Common/CrowdsaleEndTime'
import { CrowdsaleRate } from './../Common/CrowdsaleRate'
import { CrowdsaleSupply } from './../Common/CrowdsaleSupply'
import { TEXT_FIELDS } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import { isDateLaterThan } from '../../utils/validations'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { ReadOnlyWhitelistAddresses } from './ReadOnlyWhitelistAddresses'
import classNames from 'classnames'

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}
const { CROWDSALE_SETUP_NAME, WALLET_ADDRESS } = TEXT_FIELDS
const dateToTimestamp = (date) => new Date(date).getTime()

export const ManageTierBlock = ({
  fields,
  canEditTiers,
  aboutTier,
  ...props
}) => (
  <div>
    {fields.map((name, index) => {
      const currentTier = fields.value[index]
      const { tier, walletAddress, updatable } = currentTier
      const { startTime: initialStartTime, endTime: initialEndTime } = fields.initial[index]

      const tierHasStarted = !isDateLaterThan()(dateToTimestamp(initialStartTime))(Date.now())
      const tierHasEnded = !isDateLaterThan()(dateToTimestamp(initialEndTime))(Date.now())
      const canEdit = canEditTiers && updatable && !tierHasEnded
      const isWhitelistEnabled = fields.initial[0].whitelistEnabled === 'yes'

      return (
        <div className="steps" key={index}>
          <div className='steps-content container'>
            {index === 0 ? aboutTier : null}

            <div className={classNames('hidden', { 'divisor': isWhitelistEnabled })}>
              <div className="input-block-container">
                <InputField side='left' type='text' title={CROWDSALE_SETUP_NAME} value={tier} disabled={true}/>
                <InputField side='right' type='text' title={WALLET_ADDRESS} value={walletAddress} disabled={true}/>
              </div>

              <div className="input-block-container">
                <CrowdsaleStartTime
                  name={`${name}.startTime`}
                  index={index}
                  disabled={!canEdit || tierHasStarted}
                  side="left"
                  errorStyle={inputErrorStyle}
                />
                <CrowdsaleEndTime
                  name={`${name}.endTime`}
                  index={index}
                  disabled={!canEdit}
                  side="right"
                  errorStyle={inputErrorStyle}
                />
              </div>

              <div className="input-block-container">
                <CrowdsaleRate
                  name={`${name}.rate`}
                  side="left"
                  disabled={!canEdit || tierHasStarted}
                  errorStyle={inputErrorStyle}
                />
                <CrowdsaleSupply
                  name={`${name}.supply`}
                  side="right"
                  disabled={!canEdit || tierHasStarted}
                  errorStyle={inputErrorStyle}
                />
              </div>
            </div>
            {isWhitelistEnabled ? (
              <div>
                <div className="section-title">
                  <p className="title">Whitelist</p>
                </div>
                {canEdit
                  ? <WhitelistInputBlock key={index.toString()} num={index} decimals={props.decimals}/>
                  : <ReadOnlyWhitelistAddresses tier={currentTier}/>
                }
              </div>
            ) : null}
          </div>
        </div>
      )
    })}
  </div>
)
