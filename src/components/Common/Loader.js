import React from 'react'

export const Loader = ({ show }) => {
  return show ? (
    <div className="sw-FullscreenBackdrop">
      <div className="sw-Loader">
        <div className="sw-Loader_AnimatedItem" />
        <div className="sw-Loader_AnimatedItem" />
        <div className="sw-Loader_AnimatedItem" />
        <div className="sw-Loader_AnimatedItem" />
        <div className="sw-Loader_AnimatedItem" />
        <div className="sw-Loader_AnimatedItem" />
      </div>
    </div>
  ) : null
}
export default Loader
