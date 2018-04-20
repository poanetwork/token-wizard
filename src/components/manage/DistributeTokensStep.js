import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

export const DistributeTokensStep = ({ disabled, handleClick }) => (
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
          Distribute tokens
        </span>
      </Link>
    </div>
  </div>
)
