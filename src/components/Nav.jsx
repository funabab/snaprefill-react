import { useEffect } from 'react'
import classNames from 'classnames'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import '../css/nav.css'

const Nav = ({ containerRef }) => {
  const location = useLocation()

  useEffect(() => {
    if (containerRef && containerRef.current) {
      const container = containerRef.current
      if (location.pathname === '/') {
        container.classList.remove('bg-white')
      } else {
        container.classList.add('bg-white')
      }
    }
  }, [containerRef, location])

  return (
    <nav
      className={classNames('bg-grey-800 bg-opacity-40 z-10', {
        'text-dark': location.pathname !== '/',
      })}
    >
      <ul>
        <li>
          <NavLink to="/" activeClassName="active" exact>
            <span className="icon-camera"></span>
            <span>Camera</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" activeClassName="active">
            <span className="icon-back-in-time"></span>
            <span>History</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" activeClassName="active">
            <span className="icon-help-circled"></span>
            <span>Help</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

Nav.propTypes = {
  containerRef: PropTypes.shape({
    current: PropTypes.object,
  }),
}

export default Nav
