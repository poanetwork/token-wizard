import React from 'react'
import { CrowdsaleEndTime } from './../Common/CrowdsaleEndTime'
import { CrowdsaleRate } from './../Common/CrowdsaleRate'
import { CrowdsaleStartTime } from './../Common/CrowdsaleStartTime'
import { InputField } from '../Common/InputField'
import { Supply } from './../Common/Supply'
import { TEXT_FIELDS, DESCRIPTION } from '../../utils/constants'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { dateToTimestamp } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
import { isDateLaterThan } from '../../utils/validations'

export const ManageDutchAuctionBlock = inject('crowdsaleStore', 'tokenStore')(
  observer(({ fields, canEditTiers, crowdsaleStore, tokenStore, aboutTier, ...props }) => (
    <div className="mng-ManageDutchAuctionBlock">
      {fields.map((name, index) => {
        const { endTime: initialEndTime, whitelistEnabled } = fields.initial[index]
        const tierHasEnded = !isDateLaterThan()(dateToTimestamp(initialEndTime))(Date.now())
        const canEditWhiteList = canEditTiers && !tierHasEnded
        const isWhitelistEnabled = whitelistEnabled === 'yes'

        return (
          <div className="mng-ManageDutchAuctionBlock_Content" key={index}>
            <div className="mng-ManageDutchAuctionBlock_ItemsContainer">
              <div className="mng-ManageDutchAuctionBlock_Item">
                <InputField
                  disabled={true}
                  readOnly={true}
                  title={TEXT_FIELDS.MIN_CAP}
                  type="text"
                  value={fields.initial[0]['minCap']}
                />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <InputField
                  disabled={true}
                  readOnly={true}
                  title={TEXT_FIELDS.BURN_EXCESS}
                  type="text"
                  value={fields.initial[0]['burnExcess']}
                />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <CrowdsaleStartTime
                  description={DESCRIPTION.START_TIME_DUTCH_AUCTION}
                  disabled={true}
                  index={index}
                  name={`${name}.startTime`}
                  readOnly={true}
                />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <CrowdsaleEndTime
                  description={DESCRIPTION.END_TIME_DUTCH_AUCTION}
                  disabled={true}
                  index={index}
                  name={`${name}.endTime`}
                  readOnly={true}
                />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <CrowdsaleRate name={`${name}.minRate`} label={TEXT_FIELDS.MIN_RATE} disabled={true} readOnly={true} />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <CrowdsaleRate name={`${name}.maxRate`} label={TEXT_FIELDS.MAX_RATE} disabled={true} readOnly={true} />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <CrowdsaleRate disabled={true} label={TEXT_FIELDS.CURRENT_RATE} name={`${name}.rate`} readOnly={true} />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <Supply
                  description={DESCRIPTION.SUPPLY_DUTCH_AUCTION}
                  disabled={true}
                  label={TEXT_FIELDS.CROWDSALE_SUPPLY}
                  name={`${name}.supply`}
                  readOnly={true}
                />
              </div>
              <div className="mng-ManageDutchAuctionBlock_Item">
                <Supply
                  description={DESCRIPTION.TOKEN_SUPPLY}
                  disabled={true}
                  label={TEXT_FIELDS.TOKEN_SUPPLY}
                  name={`token.supply`}
                  readOnly={true}
                  value={tokenStore.supply}
                />
              </div>
            </div>
            {isWhitelistEnabled ? (
              <WhitelistInputBlock
                decimals={tokenStore.decimals}
                num={index}
                readOnly={!canEditWhiteList}
                showTableHeader={!canEditWhiteList}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  ))
)
