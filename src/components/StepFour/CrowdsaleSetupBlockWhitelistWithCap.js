import React from 'react'
import { DisplayField } from '../Common/DisplayField'
import { PUBLISH_DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { convertDateToUTCTimezoneToDisplay } from '../../utils/utils'

export const CrowdsaleSetupBlockWhitelistWithCap = tierStore => {
  const { tiers } = tierStore.tierStore
  const firstTier = tiers[0]
  const { walletAddress, startTime } = firstTier
  const startTimeWithUTC = convertDateToUTCTimezoneToDisplay(startTime)
  const lasTierInd = tiers.length - 1
  const endTimeWithUTC = convertDateToUTCTimezoneToDisplay(tiers[lasTierInd].endTime)
  const { WALLET_ADDRESS, CROWDSALE_START_TIME, CROWDSALE_END_TIME } = TEXT_FIELDS
  const {
    WALLET_ADDRESS: PD_WALLET_ADDRESS,
    CROWDSALE_START_TIME: PD_CROWDSALE_START_TIME,
    CROWDSALE_END_TIME: PD_CROWDSALE_END_TIME
  } = PUBLISH_DESCRIPTION

  return (
    <div className="cs-CrowdsaleSetupBlockWhitelistWithCap">
      <DisplayField
        description={PD_WALLET_ADDRESS}
        extraClassName="pb-DisplayField-WalletAddress"
        title={WALLET_ADDRESS}
        value={walletAddress}
      />
      <DisplayField
        description={PD_CROWDSALE_START_TIME}
        extraClassName="pb-DisplayField-CrowdsaleStartTime"
        mobileTextSize="small"
        title={CROWDSALE_START_TIME}
        value={startTimeWithUTC}
      />
      <DisplayField
        description={PD_CROWDSALE_END_TIME}
        extraClassName="pb-DisplayField-CrowdsaleEndTime"
        mobileTextSize="small"
        title={CROWDSALE_END_TIME}
        value={endTimeWithUTC}
      />
    </div>
  )
}
