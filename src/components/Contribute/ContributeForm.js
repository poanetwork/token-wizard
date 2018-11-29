import React from 'react'
import { inject, observer } from 'mobx-react'
import { Field, FormSpy } from 'react-final-form'
import { CONTRIBUTION_OPTIONS } from '../../utils/constants'
import { InputField2 } from '../Common/InputField2'
import {
  composeValidators,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan,
  isRequired
} from '../../utils/validations'
import { TokenDimension } from '../Common/TokenDimension'

export const ContributeForm = inject('contributeStore', 'tokenStore')(
  observer(({ handleSubmit, pristine, invalid, ...props }) => {
    const {
      contributeThrough,
      updateContributeThrough,
      web3Available,
      contributeStore,
      tokenStore,
      isEnded,
      isFinalized,
      isStarted,
      isSoldOut,
      isTierSoldOut
    } = props
    const { decimals } = tokenStore
    const buttonDisabled = pristine || invalid || isEnded || isFinalized || isSoldOut || isTierSoldOut

    const contributeThroughWallet = () => {
      return contributeThrough === CONTRIBUTION_OPTIONS.METAMASK
    }

    const ContributeButton = contributeThroughWallet() ? (
      <button className="cnt-ContributeForm_ContributeButton" onClick={handleSubmit} disabled={buttonDisabled}>
        Contribute
      </button>
    ) : null

    const canContribute = !(isEnded || isFinalized || isSoldOut)

    const validateContribute = value => {
      const decimalsErr = `Number of tokens to buy should be positive and should not exceed ${decimals} decimals.`
      const minimumContributionErr =
        isFinite(props.minimumContribution) && canContribute
          ? `Minimum valid contribution: ${props.minimumContribution}`
          : `You are not allowed`
      let errors = composeValidators(
        isRequired(),
        isDecimalPlacesNotGreaterThan(decimalsErr)(decimals),
        isGreaterOrEqualThan(minimumContributionErr)(props.minimumContribution)
      )(value)

      if (!isStarted && errors && errors.length > 0) {
        errors = ['You are not allowed']
      }

      if (errors) return errors.shift()
    }

    const tokensToContributeOnChange = ({ values }) => {
      if (values && values.contribute !== undefined) {
        contributeStore.setProperty('tokensToContribute', values.contribute)
      }
    }

    return (
      <form className={`cnt-ContributeForm`} onSubmit={handleSubmit}>
        <h3 className="cnt-ContributeForm_Title">Choose amount to contribute</h3>
        <div className="cnt-ContributeForm_AmountContainer">
          <Field
            component={InputField2}
            extraClassName="cnt-ContributeForm_Amount"
            name="contribute"
            placeholder="0"
            validate={validateContribute}
          />
          <TokenDimension type="tokens" />
        </div>
        <select value={contributeThrough} className="sw_Select" onChange={e => updateContributeThrough(e.target.value)}>
          <option disabled={!web3Available} value={CONTRIBUTION_OPTIONS.METAMASK}>
            Wallet {!web3Available ? ' (not available)' : null}
          </option>
          <option value={CONTRIBUTION_OPTIONS.QR}>QR</option>
        </select>
        {ContributeButton}
        <FormSpy subscription={{ values: true }} onChange={tokensToContributeOnChange} />
      </form>
    )
  })
)
