import React from 'react'

export const Loader = ({ show }) => {
  return (
    <div className={show ? 'loading-container' : 'loading-container notdisplayed'}>
      <div className="loading" />
      <div className="loading-text-container">
        <div className="loading-text">Do not refresh the webpage</div>
      </div>
      <div className="loading-progress">
        <div className="loading-i" />
        <div className="loading-i" />
        <div className="loading-i" />
        <div className="loading-i" />
        <div className="loading-i" />
        <div className="loading-i" />
      </div>
    </div>
  )
}
