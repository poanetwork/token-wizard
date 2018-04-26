import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import ReservedTokensItem from '../Common/ReservedTokensItem'
import { inject, observer } from 'mobx-react'

export const DistributeTokensStep = inject('reservedTokenStore')(observer(
  ({ reservedTokenStore, owner, disabled, handleClick }) => (
    <div className="steps-content container">
      <div className="about-step">
        <div className="swal2-icon swal2-info warning-logo">!</div>
        <p className="title">Distribute reserved tokens</p>
        <p className="description">
          Reserved tokens distribution is the last step of the crowdsale before finalization.
          You can make it after the end of the last tier or if hard cap is reached. If you reserved more then 100
          addresses for your crowdsale, the distribution will be executed in batches with 100 reserved addresses per
          batch. Amount of batches is equal to amount of transactions
        </p>
        <Link to='#' onClick={() => !disabled ? handleClick(100) : undefined}>
        <span className={classNames(
          'button',
          {
            'button_disabled': disabled,
            'button_fill': !disabled
          }
        )}>
          Distribute reserved tokens
        </span>
        </Link>
        {!owner ? null : (
          <div className="reserved-tokens read-only">
            <div className="reserved-tokens-item-container-inner">
              <span className="reserved-tokens-item reserved-tokens-item-left"><strong>Address</strong></span>
              <span className="reserved-tokens-item reserved-tokens-item-middle"><strong>Dimension</strong></span>
              <span className="reserved-tokens-item reserved-tokens-item-right"><strong>Value</strong></span>
            </div>
            {reservedTokenStore.tokens.map((token, index) => (
              <ReservedTokensItem
                key={index}
                num={index}
                addr={token.addr}
                dim={token.dim}
                val={token.val}
                readOnly={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  ))
)
