import React, { useState, useEffect } from "react"
import { Collapse, Container, Navbar, NavbarToggler } from "reactstrap"
import ConfirmLogout from "./ConfirmLogout"
import { RootState } from "app/rootReducer"

import { useSelector, useDispatch } from "react-redux"
import { fetchUserInfo } from "features/navMenu/userInfoSlice"
import { NavLink, NavItem } from "react-bootstrap"

const NavMenu = () => {

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)
  const [showConfirmLogoutModal, setShowConfirmLogoutModal] = useState<boolean>(false)
  const { username, error } = useSelector((state: RootState) => state.userInfo)
  const dispatch = useDispatch()

  useEffect(() => {
      if (!username) {
        dispatch(fetchUserInfo())
      }
    }, []
  )

  if (error) {
    return (<div>TODO</div>)
  }

  return (
    <header>
      <Navbar
        className="navbar navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-3"
        light>
        <Container>
          <a className="navbar-brand" href="/">
            CosmosTest
          </a>
          <NavbarToggler
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mr-2" />
          <Collapse
            className="collapse navbar-collapse"
            isOpen={!isCollapsed}
            navbar>
            <ul className="navbar-nav mr-auto">
              <NavItem>
                <NavLink className="text-dark" href="/reactapp">React-version</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="text-dark" href="/TaskItemMvc">MVC-version</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="text-dark" href="/reactapp/anotherPage.html">Another Page</NavLink>
              </NavItem>
            </ul>

            {username ? (
              <div>
                <span className="navbar-text" style={{ marginRight: "5px" }}>
                  Logged in as
                </span>
                <span className="navbar-text text-dark">{username}</span>
              </div>
            ) : null}

            {username ? (<span
                onClick={() => setShowConfirmLogoutModal(true)}
                className="nav-link text-dark"
                style={{ cursor: "pointer" }}>
                Logout
              </span>)
              : (<a
                href="/Login?ReturnUrl=/reactapp"
                className="nav-link text-dark">
                Login
              </a>)}
          </Collapse>
        </Container>
      </Navbar>

      <ConfirmLogout
        show={showConfirmLogoutModal}
        onHide={() => setShowConfirmLogoutModal(false)}
        onLogout={() => (window.location = "/login" as any)}
      />
    </header>
  )
}
export default NavMenu
