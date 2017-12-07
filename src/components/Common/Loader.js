import React from 'react'
import '../../assets/stylesheets/application.css';

export const Loader = ({show}) => {
  return <div className={show?"loading-container":"loading-container notdisplayed"}>
    <div className="loading">
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
    </div>
  </div>
}

