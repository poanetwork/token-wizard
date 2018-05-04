import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import ReservedTokensItem from '../Common/ReservedTokensItem'
import { inject, observer } from 'mobx-react'

export const DistributeTokensStep = inject('reservedTokenStore')(observer(
  ({ reservedTokenStore, owner, disabled, handleClick }) => {
    return reservedTokenStore.tokens.length == 0 ? null : (
    <div className="steps-content container">
      <div className="about-step">
        <div className="swal2-icon swal2-info warning-logo">!</div>
        <p className="title">Reserved tokens</p>
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
    )
  })
)
