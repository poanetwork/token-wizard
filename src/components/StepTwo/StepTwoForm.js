import React from 'react'
import { ButtonBack } from '../Common/ButtonBack'
import { ButtonContinue } from '../Common/ButtonContinue'
import { CROWDSALE_STRATEGIES } from '../../utils/constants'
import { FormSpy } from 'react-final-form'
import { inject, observer } from 'mobx-react'
import { ReservedTokensInputBlock } from '../Common/ReservedTokensInputBlock'
import { TokenDecimals } from '../Common/TokenDecimals'
import { TokenName } from '../Common/TokenName'
import { TokenSupply } from '../Common/TokenSupply'
import { TokenTicker } from '../Common/TokenTicker'
import classNames from 'classnames'

const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES

export const StepTwoForm = inject('tokenStore', 'crowdsaleStore', 'reservedTokenStore')(
  observer(
    ({
      handleSubmit,
      invalid,
      pristine,
      submitting,
      mutators: { setFieldTouched },
      form,
      id,
      reload,
      history,
      tokenStore,
      crowdsaleStore,
      reservedTokenStore
    }) => {
      const status = !(submitting || invalid)

      const disableDecimals = crowdsaleStore.isMintedCappedCrowdsale && !!reservedTokenStore.tokens.length

      const reservedTokens = crowdsaleStore.strategy === MINTED_CAPPED_CROWDSALE ? <ReservedTokensInputBlock /> : null

      const tokenSupply = crowdsaleStore.strategy === DUTCH_AUCTION ? <TokenSupply /> : null

      const topBlockExtraClass = classNames({
        'sw-BorderedBlock-2Rows2Columns': crowdsaleStore.strategy === DUTCH_AUCTION,
        'sw-BorderedBlock-3Columns': crowdsaleStore.strategy !== DUTCH_AUCTION
      })

      const setFieldAsTouched = () => {
        if (reload) {
          form.mutators.setFieldTouched('name', true)
          form.mutators.setFieldTouched('ticker', true)
          form.mutators.setFieldTouched('decimals', true)
          form.mutators.setFieldTouched('supply', true)
        }
      }

      const onChangeForm = ({ values, errors }) => {
        tokenStore.updateTokenStore({ values, errors })
        setFieldAsTouched()
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
        <form id={id} onSubmit={handleSubmit} className="st-StepContent_FormFullHeight">
          <div className={`sw-BorderedBlock ${topBlockExtraClass}`}>
            <TokenName />
            <TokenTicker />
            <TokenDecimals disabled={disableDecimals} />
            {tokenSupply}
          </div>
          {reservedTokens}
          <FormSpy onChange={onChangeForm} />
          <div className="st-StepContent_Buttons">
            <ButtonBack onClick={goBack} />
            <ButtonContinue type="submit" status={status} />
          </div>
        </form>
      )
    }
  )
)
