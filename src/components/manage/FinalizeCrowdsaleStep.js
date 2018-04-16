import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

export const FinalizeCrowdsaleStep = ({ disabled, handleClick }) => (
  <div className="steps-content container">
    <div className="about-step">
      <div className="swal2-icon swal2-info warning-logo">!</div>
      <p className="title">Finalize Crowdsale</p>
      <p className="description">
        Finalize - Finalization is the last step of the crowdsale.
        You can make it only after the end of the last tier. After finalization, it's not possible to update tiers, buy
        tokens. All tokens will be movable, reserved tokens will be issued.
      </p>
      <Link to='#' onClick={() => !disabled ? handleClick() : undefined}>
      <span className={classNames(
        'button',
        {
          'button_disabled': disabled,
          'button_fill': !disabled
        }
      )}>
        Finalize Crowdsale
      </span>
      </Link>
    </div>
  </div>
)
