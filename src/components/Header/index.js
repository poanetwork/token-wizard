import React from 'react'
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { displayHeaderAndFooterInIframe } from '../../utils/utils'

export const Header = () => {
  const displayHeader = displayHeaderAndFooterInIframe()

  const header = (
    <header className="header">
      <div className="container">
        <Link className="logo" to='/'/>
      </div>
    </header>
  )

  return displayHeader ? header : null
}
