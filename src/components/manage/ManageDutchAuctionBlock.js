import React from 'react'
import { CrowdsaleStartTime } from './../Common/CrowdsaleStartTime'
import { CrowdsaleEndTime } from './../Common/CrowdsaleEndTime'
import { CrowdsaleRate } from './../Common/CrowdsaleRate'
import { CrowdsaleSupply } from './../Common/CrowdsaleSupply'
import { TEXT_FIELDS, DESCRIPTION, CROWDSALE_STRATEGIES_DISPLAYNAMES } from '../../utils/constants'
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
const { WALLET_ADDRESS, STRATEGY } = TEXT_FIELDS
const dateToTimestamp = (date) => new Date(date).getTime()

export const ManageDutchAuctionBlock = ({
  fields,
  canEditTiers,
  crowdsaleStore,
  aboutTier,
  ...props
}) => (
  <div>
    {fields.map((name, index) => {
      const currentTier = fields.value[index]
      let { walletAddress, updatable } = currentTier
      const { startTime: initialStartTime, endTime: initialEndTime } = fields.initial[index]

      updatable = crowdsaleStore.isDutchAuction ? true : updatable

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
                <InputField side='left' type='text' title={STRATEGY} value={CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION} disabled={true}/>
                <InputField side='right' type='text' title={WALLET_ADDRESS} value={walletAddress} disabled={true}/>
              </div>

              <div className="input-block-container">
                <CrowdsaleStartTime
                  name={`${name}.startTime`}
                  index={index}
                  disabled={true}
                  side="left"
                  description={DESCRIPTION.START_TIME_DUTCH_AUCTION}
                  errorStyle={inputErrorStyle}
                />
                <CrowdsaleEndTime
                  name={`${name}.endTime`}
                  index={index}
                  disabled={true}
                  side="right"
                  description={DESCRIPTION.END_TIME_DUTCH_AUCTION}
                  errorStyle={inputErrorStyle}
                />
              </div>

              <div className="input-block-container">
                <CrowdsaleRate
                  name={`${name}.rate`}
                  side="left"
                  label={TEXT_FIELDS.RATE}
                  disabled={true}
                  errorStyle={inputErrorStyle}
                />
                <CrowdsaleSupply
                  name={`${name}.supply`}
                  side="right"
                  description={DESCRIPTION.SUPPLY_DUTCH_AUCTION}
                  disabled={true}
                  errorStyle={inputErrorStyle}
                />
              </div>
            </div>
            { crowdsaleStore.isMintedCappedCrowdsale & isWhitelistEnabled ? (
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
