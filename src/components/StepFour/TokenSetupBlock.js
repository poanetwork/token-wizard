import React from 'react'
import { DisplayField } from '../Common/DisplayField'
import { PUBLISH_DESCRIPTION, TEXT_FIELDS, DESCRIPTION } from '../../utils/constants'

export const TokenSetupBlock = tokenStore => {
  const { supply, name, ticker, decimals } = tokenStore.tokenStore
  const tokenSupplyStr = supply ? supply.toString() : '0'
  const tokenNameStr = name ? name : ''
  const tokenDecimalsStr = decimals ? decimals.toString() : ''
  const {
    TOKEN_TOTAL_SUPPLY: PD_TOKEN_TOTAL_SUPPLY,
    TOKEN_NAME: PD_TOKEN_NAME,
    TOKEN_DECIMALS: PD_TOKEN_DECIMALS
  } = PUBLISH_DESCRIPTION
  const { TOKEN_TICKER: D_TOKEN_TICKER } = DESCRIPTION
  const { NAME, TICKER, DECIMALS, SUPPLY_SHORT } = TEXT_FIELDS

  return (
    <div className="ts-TokenSetupBlock">
      <DisplayField description={PD_TOKEN_NAME} title={NAME} value={tokenNameStr} />
      <DisplayField
        extraClassName={'pb-DisplayField_Value-uppercase'}
        title={TICKER}
        value={ticker ? ticker : ''}
        description={D_TOKEN_TICKER}
      />
      <DisplayField title={DECIMALS} value={tokenDecimalsStr} description={PD_TOKEN_DECIMALS} />
      <DisplayField title={SUPPLY_SHORT} value={tokenSupplyStr} description={PD_TOKEN_TOTAL_SUPPLY} />
    </div>
  )
}
