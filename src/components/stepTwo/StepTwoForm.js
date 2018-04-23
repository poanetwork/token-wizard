import React from 'react'
import { FormSpy } from 'react-final-form'
import { TokenName } from '../Common/TokenName'
import { TokenTicker } from '../Common/TokenTicker'
import { TokenDecimals } from '../Common/TokenDecimals'
import { ReservedTokensInputBlock } from '../Common/ReservedTokensInputBlock'

const errorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const StepTwoForm = ({
  id,
  handleSubmit,
  disableDecimals,
  updateTokenStore,
  tokens,
  decimals,
  addReservedTokensItem,
  removeReservedToken,
  clearAll
}) => {
  return (
    <form id={id} onSubmit={handleSubmit}>
      <div className="hidden">
        <TokenName errorStyle={errorStyle}/>
        <TokenTicker errorStyle={errorStyle}/>
        <TokenDecimals disabled={disableDecimals} errorStyle={errorStyle}/>
      </div>
      <div className="reserved-tokens-title">
        <p className="title">Reserved tokens</p>
      </div>
      <ReservedTokensInputBlock
        tokens={tokens}
        decimals={decimals}
        addReservedTokensItem={addReservedTokensItem}
        removeReservedToken={removeReservedToken}
        clearAll={clearAll}
      />

      <div className="button-container">
        <a onClick={e => { e.preventDefault(); handleSubmit() }} className="button button_fill">Continue</a>
      </div>

      <FormSpy onChange={updateTokenStore}/>
    </form>
  )
}
