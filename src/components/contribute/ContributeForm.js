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
import classNames from 'classnames'

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
      isSoldOut,
      isTierSoldOut
    } = props
    const { decimals } = tokenStore

    const buttonDisabled = pristine || invalid || isEnded || isFinalized || isSoldOut || isTierSoldOut
    const contributeButtonClasses = classNames('button', 'button_fill', 'button_no_border', {
      button_disabled: buttonDisabled
    })

    const ContributeButton =
      contributeThrough === CONTRIBUTION_OPTIONS.METAMASK ? (
        <button className={contributeButtonClasses} onClick={handleSubmit} disabled={buttonDisabled}>
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
      const errors = composeValidators(
        isRequired(),
        isDecimalPlacesNotGreaterThan(decimalsErr)(decimals),
        isGreaterOrEqualThan(minimumContributionErr)(props.minimumContribution)
      )(value)
      if (errors) return errors.shift()
    }

    const tokensToContributeOnChange = ({ values }) => {
      if (values && values.contribute !== undefined) {
        contributeStore.setProperty('tokensToContribute', values.contribute)
      }
    }

    return (
      <form className="contribute-form" onSubmit={handleSubmit}>
        <label className="contribute-form-label">Choose amount to contribute</label>

        <div className="contribute-form-input-container">
          <Field
            name="contribute"
            component={InputField2}
            validate={validateContribute}
            placeholder="0"
            inputClassName="contribute-form-input"
          />
          <FormSpy subscription={{ values: true }} onChange={tokensToContributeOnChange} />
          <div className="contribute-form-label">TOKENS</div>
        </div>

        <div className="contribute-through-container">
          <select
            value={contributeThrough}
            className="contribute-through"
            onChange={e => updateContributeThrough(e.target.value)}
          >
            <option disabled={!web3Available} value={CONTRIBUTION_OPTIONS.METAMASK}>
              Metamask {!web3Available ? ' (not available)' : null}
            </option>
            <option value={CONTRIBUTION_OPTIONS.QR}>QR</option>
          </select>
          {ContributeButton}
        </div>

        <p className="description">
          Think twice before contributing to Crowdsales. Tokens will be deposited on a wallet you used to buy tokens.
        </p>
      </form>
    )
  })
)
