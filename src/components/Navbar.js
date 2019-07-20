import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

class Navbar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className="uk-navbar-container" uk-navbar="true">
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <li><NavLink activeClassName="active" to="/" exact>Home</NavLink></li>
            <li><NavLink activeClassName="active" to="/upload">Upload</NavLink></li>
            <li><NavLink activeClassName="active" to="/settings">Settings</NavLink></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar