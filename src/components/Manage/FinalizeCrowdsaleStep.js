import React from 'react'

export const FinalizeCrowdsaleStep = ({ disabled, handleClick }) => (
  <div className="mng-FinalizeCrowdsaleStep">
    <div className="mng-FinalizeCrowdsaleStep_Description">
      After finalization, it’s not possible to update tiers or buy tokens. All tokens will be movable and reserved
      tokens will be issued.
    </div>
    <button
      className="mng-FinalizeCrowdsaleStep_Button"
      disabled={disabled}
      onClick={() => (!disabled ? handleClick() : undefined)}
      type="button"
    >
      Finalize Crowdsale
    </button>
  </div>
)
