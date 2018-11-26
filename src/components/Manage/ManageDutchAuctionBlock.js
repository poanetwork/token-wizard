import React from 'react'
import { CrowdsaleStartTime } from './../Common/CrowdsaleStartTime'
import { CrowdsaleEndTime } from './../Common/CrowdsaleEndTime'
import { CrowdsaleRate } from './../Common/CrowdsaleRate'
import { Supply } from './../Common/Supply'
import { TEXT_FIELDS, DESCRIPTION, CROWDSALE_STRATEGIES_DISPLAYNAMES } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import { isDateLaterThan } from '../../utils/validations'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { ReadOnlyWhitelistAddresses } from './ReadOnlyWhitelistAddresses'
import { inject, observer } from 'mobx-react'
import { dateToTimestamp } from '../../utils/utils'

export const ManageDutchAuctionBlock = inject('crowdsaleStore', 'tokenStore')(
  observer(({ fields, canEditTiers, crowdsaleStore, tokenStore, aboutTier, ...props }) => (
    <div>
      {fields.map((name, index) => {
        const currentTier = fields.value[index]
        const { endTime: initialEndTime, whitelistEnabled } = fields.initial[index]

        const tierHasEnded = !isDateLaterThan()(dateToTimestamp(initialEndTime))(Date.now())
        const canEditWhiteList = canEditTiers && !tierHasEnded
        const isWhitelistEnabled = whitelistEnabled === 'yes'

        return (
          <div className="mng-ManageDutchAuctionBlock" key={index}>
            <div className="mng-ManageDutchAuctionBlock_ItemsContainer">
              <InputField
                type="text"
                title={TEXT_FIELDS.STRATEGY}
                value={CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION}
                disabled={true}
              />

              <CrowdsaleStartTime
                description={DESCRIPTION.START_TIME_DUTCH_AUCTION}
                disabled={true}
                index={index}
                name={`${name}.startTime`}
              />

              <CrowdsaleEndTime
                description={DESCRIPTION.END_TIME_DUTCH_AUCTION}
                disabled={true}
                index={index}
                name={`${name}.endTime`}
              />

              <CrowdsaleRate name={`${name}.minRate`} label={TEXT_FIELDS.MIN_RATE} disabled={true} />

              <CrowdsaleRate name={`${name}.maxRate`} label={TEXT_FIELDS.MAX_RATE} disabled={true} />

              <CrowdsaleRate disabled={true} label={TEXT_FIELDS.CURRENT_RATE} name={`${name}.rate`} />

              <Supply
                description={DESCRIPTION.SUPPLY_DUTCH_AUCTION}
                disabled={true}
                label={TEXT_FIELDS.CROWDSALE_SUPPLY}
                name={`${name}.supply`}
              />

              <Supply
                name={`token.supply`}
                value={tokenStore.supply}
                label={TEXT_FIELDS.TOKEN_SUPPLY}
                description={DESCRIPTION.TOKEN_SUPPLY}
                disabled={true}
              />
            </div>
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
