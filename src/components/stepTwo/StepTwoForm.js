import React from 'react'
import { ButtonBack } from '../Common/ButtonBack'
import { ButtonContinue } from '../Common/ButtonContinue'
import { CROWDSALE_STRATEGIES } from '../../utils/constants'
import { FormSpy } from 'react-final-form'
import { ReservedTokensInputBlock } from '../Common/ReservedTokensInputBlock'
import { TokenDecimals } from '../Common/TokenDecimals'
import { TokenName } from '../Common/TokenName'
import { TokenSupply } from '../Common/TokenSupply'
import { TokenTicker } from '../Common/TokenTicker'

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
  form,
  history
}) => {
  const status = !(submitting || invalid)

  const reservedTokens = (
    <div>
      <h2 className="sw-BorderedBlockTitle">Reserved tokens</h2>
      <ReservedTokensInputBlock
        addReservedTokensItem={addReservedTokensItem}
        clearAll={clearAll}
        decimals={decimals}
        removeReservedToken={removeReservedToken}
        tokens={tokens}
        validateReservedTokensList={validateReservedTokensList}
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

  const navigateTo = (location, params = '') => {
    const path =
      {
        home: '/',
        stepOne: '1',
        manage: 'manage'
      }[location] || null

    if (path === null) {
      throw new Error(`invalid location specified: ${location}`)
    }

    history.push(`${path}${params}`)
  }

  const goBack = async () => {
    navigateTo('stepOne')
  }

  return (
    <form id={id} onSubmit={handleSubmit}>
      <div className="sw-BorderedBlock">
        <TokenName />
        <TokenTicker />
        <TokenDecimals disabled={disableDecimals} />
        {crowdsaleStore.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION ? (
          <TokenSupply errorStyle={errorStyle} />
        ) : null}
      </div>
      {crowdsaleStore.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE ? reservedTokens : null}
      <FormSpy onChange={onChangeForm} />
      <div className="st-StepContent_Buttons">
        <ButtonBack onClick={goBack} />
        <ButtonContinue type="submit" status={status} />
      </div>
    </form>
  )
}
