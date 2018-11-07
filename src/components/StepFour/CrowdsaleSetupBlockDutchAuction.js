import React from 'react'
import { DisplayField } from '../Common/DisplayField'
import { PUBLISH_DESCRIPTION, TEXT_FIELDS, DESCRIPTION } from '../../utils/constants'
import { getBurnExcess } from './utils'
import { convertDateToUTCTimezoneToDisplay } from '../../utils/utils'

export const CrowdsaleSetupBlockDutchAuction = tierStore => {
  const { tiers } = tierStore.tierStore
  const firstTier = tiers[0]
  const { walletAddress, startTime, burnExcess } = firstTier
  const startTimeWithUTC = convertDateToUTCTimezoneToDisplay(startTime)
  const lasTierInd = tiers.length - 1
  const endTimeWithUTC = convertDateToUTCTimezoneToDisplay(tiers[lasTierInd].endTime)
  const { WALLET_ADDRESS, CROWDSALE_START_TIME, CROWDSALE_END_TIME, BURN_EXCESS } = TEXT_FIELDS
  const {
    WALLET_ADDRESS: PD_WALLET_ADDRESS,
    CROWDSALE_START_TIME: PD_CROWDSALE_START_TIME,
    CROWDSALE_END_TIME: PD_CROWDSALE_END_TIME
  } = PUBLISH_DESCRIPTION

  return (
    <div className="cs-CrowdsaleSetupBlockDutchAuction">
      <DisplayField
        description={PD_WALLET_ADDRESS}
        extraClass="pb-DisplayField-WalletAddress"
        title={WALLET_ADDRESS}
        value={walletAddress}
      />
      <DisplayField
        description={DESCRIPTION.BURN_EXCESS}
        extraClass="pb-DisplayField-BurnExcess"
        title={BURN_EXCESS}
        value={getBurnExcess(burnExcess)}
      />
      <DisplayField
        description={PD_CROWDSALE_START_TIME}
        extraClass="pb-DisplayField-CrowdsaleStartTime"
        mobileTextSize="small"
        title={CROWDSALE_START_TIME}
        value={startTimeWithUTC}
      />
      <DisplayField
        description={PD_CROWDSALE_END_TIME}
        extraClass="pb-DisplayField-CrowdsaleEndTime"
        mobileTextSize="small"
        title={CROWDSALE_END_TIME}
        value={endTimeWithUTC}
      />
    </div>
  )
}
