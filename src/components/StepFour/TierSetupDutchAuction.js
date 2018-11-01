import React from 'react'
import { DisplayField } from '../Common/DisplayField'
import { DESCRIPTION, PUBLISH_DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { convertDateToUTCTimezoneToDisplay } from '../../utils/utils'
import { isWhitelisted } from './utils'

export const TierSetupDutchAuction = tier => {
  const { GLOBAL_MIN_CAP, MIN_RATE, MAX_RATE, START_TIME, END_TIME, ENABLE_WHITELISTING, MAX_CAP } = TEXT_FIELDS
  const { RATE: D_RATE } = DESCRIPTION
  const {
    TIER_START_TIME: PD_TIER_START_TIME,
    TIER_END_TIME: PD_TIER_END_TIME,
    GLOBAL_MIN_CAP: PD_GLOBAL_MIN_CAP,
    HARD_CAP: PD_HARD_CAP,
    ENABLE_WHITELISTING: PD_ENABLE_WHITELISTING
  } = PUBLISH_DESCRIPTION
  const { endTime, maxRate, minCap, minRate, startTime, supply, whitelistEnabled } = tier.tier
  const tierMinRateStr = minRate ? minRate : 0
  const tierMaxRateStr = maxRate ? maxRate : 0
  const tierStartTimeStr = convertDateToUTCTimezoneToDisplay(startTime)
  const tierEndTimeStr = convertDateToUTCTimezoneToDisplay(endTime)
  const tierIsWhitelisted = isWhitelisted(whitelistEnabled)
  const tierSupplyStr = supply ? supply : ''

  return (
    <div className="ts-TierSetupDutchAuction">
      <DisplayField
        description={PD_TIER_START_TIME}
        mobileTextSize="small"
        title={START_TIME}
        value={tierStartTimeStr}
      />
      <DisplayField description={PD_TIER_END_TIME} mobileTextSize="small" title={END_TIME} value={tierEndTimeStr} />
      <DisplayField title={GLOBAL_MIN_CAP} value={minCap} description={PD_GLOBAL_MIN_CAP} />
      <DisplayField title={MAX_CAP} value={tierSupplyStr} description={PD_HARD_CAP} />
      <DisplayField title={MIN_RATE} value={tierMinRateStr} description={D_RATE} />
      <DisplayField title={MAX_RATE} value={tierMaxRateStr} description={D_RATE} />
      <DisplayField title={ENABLE_WHITELISTING} value={tierIsWhitelisted} description={PD_ENABLE_WHITELISTING} />
    </div>
  )
}
