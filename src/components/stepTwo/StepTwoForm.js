import React from 'react'
import { FormSpy } from 'react-final-form'
import { TokenName } from '../Common/TokenName'
import { TokenTicker } from '../Common/TokenTicker'
import { TokenDecimals } from '../Common/TokenDecimals'
import { TokenSupply } from '../Common/TokenSupply'
import { ReservedTokensInputBlock } from '../Common/ReservedTokensInputBlock'
import { CROWDSALE_STRATEGIES } from '../../utils/constants'
import { ButtonContinue } from '../Common/ButtonContinue'

const errorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px'
}

export const StepTwoForm = ({
  id,
  handleSubmit,
  disableDecimals,
  updateTokenStore,
  tokens,
  decimals,
  addReservedTokensItem,
  validateReservedTokensList,
  removeReservedToken,
  clearAll,
  crowdsaleStore,
  invalid,
  pristine,
  submitting,
  mutators: { setFieldTouched },
  reload,
  form
}) => {
  const status = !(submitting || invalid)

  const reservedTokens = (
    <div>
      <div className="reserved-tokens-title">
        <p className="title">Reserved tokens</p>
      </div>
      <ReservedTokensInputBlock
        tokens={tokens}
        decimals={decimals}
        addReservedTokensItem={addReservedTokensItem}
        removeReservedToken={removeReservedToken}
        validateReservedTokensList={validateReservedTokensList}
        clearAll={clearAll}
      />
    </div>
  )

  const setFieldAsTouched = ({ values, errors }) => {
    if (reload) {
      form.mutators.setFieldTouched('name', true)
      form.mutators.setFieldTouched('ticker', true)
      form.mutators.setFieldTouched('decimals', true)
      form.mutators.setFieldTouched('supply', true)
    }
  }

  const onChangeForm = ({ values, errors }) => {
    updateTokenStore({ values, errors })
    setFieldAsTouched({ values, errors })
  }

  return (
    <form id={id} onSubmit={handleSubmit}>
      <div className="hidden">
        <TokenName errorStyle={errorStyle} />
        <TokenTicker errorStyle={errorStyle} />
        <TokenDecimals disabled={disableDecimals} errorStyle={errorStyle} />
        {crowdsaleStore.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION ? (
          <TokenSupply errorStyle={errorStyle} />
        ) : null}
      </div>
      {crowdsaleStore.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE ? reservedTokens : null}

      <div className="button-container">
        <ButtonContinue type="submit" status={status} />
      </div>

      <FormSpy onChange={onChangeForm} />
    </form>
  )
}
