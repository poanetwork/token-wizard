import React from 'react'
import { DisplayField } from '../Common/DisplayField'
import { PUBLISH_DESCRIPTION, TEXT_FIELDS, DESCRIPTION } from '../../utils/constants'
import { convertDateToUTCTimezoneToDisplay } from '../../utils/utils'
import { isTierUpdatable, isWhitelisted } from './utils'

export const TierSetupWhitelistWithCap = tier => {
  const { GLOBAL_MIN_CAP, START_TIME, END_TIME, ENABLE_WHITELISTING, MAX_CAP, ALLOW_MODIFYING, RATE } = TEXT_FIELDS
  const { RATE: D_RATE, ALLOW_MODIFYING: D_ALLOW_MODIFYING } = DESCRIPTION
  const {
    TIER_START_TIME: PD_TIER_START_TIME,
    TIER_END_TIME: PD_TIER_END_TIME,
    GLOBAL_MIN_CAP: PD_GLOBAL_MIN_CAP,
    HARD_CAP: PD_HARD_CAP,
    ENABLE_WHITELISTING: PD_ENABLE_WHITELISTING
  } = PUBLISH_DESCRIPTION
  const { endTime, minCap, startTime, supply, whitelistEnabled, updatable, rate } = tier.tier
  const tierEndTimeStr = convertDateToUTCTimezoneToDisplay(endTime)
  const tierIsUpdatable = isTierUpdatable(updatable)
  const tierIsWhitelisted = isWhitelisted(whitelistEnabled)
  const tierRateStr = rate ? rate : 0
  const tierStartTimeStr = convertDateToUTCTimezoneToDisplay(startTime)
  const tierSupplyStr = supply ? supply : ''

  return (
    <div className="ts-TierSetupWhitelistWithCap">
      <DisplayField
        description={PD_TIER_START_TIME}
        mobileTextSize="small"
        title={START_TIME}
        value={tierStartTimeStr}
      />
      <DisplayField description={PD_TIER_END_TIME} mobileTextSize="small" title={END_TIME} value={tierEndTimeStr} />
      <DisplayField title={ENABLE_WHITELISTING} value={tierIsWhitelisted} description={PD_ENABLE_WHITELISTING} />
      <DisplayField title={ALLOW_MODIFYING} value={tierIsUpdatable} description={D_ALLOW_MODIFYING} />
      <DisplayField title={GLOBAL_MIN_CAP} value={minCap} description={PD_GLOBAL_MIN_CAP} />
      <DisplayField title={MAX_CAP} value={tierSupplyStr} description={PD_HARD_CAP} />
      <DisplayField title={RATE} value={tierRateStr} description={D_RATE} />
    </div>
  )
}
