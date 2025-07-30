import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Bid Builder</h1>
          </Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">Dashboard</Link>
            </li>
            <li>
              <Link to="/bid-builder" className="nav-link">Create Bid</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header 