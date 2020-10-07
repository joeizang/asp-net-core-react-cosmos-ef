import React from "react"
import { Container } from "reactstrap"
import NavMenu from "features/navMenu/NavMenu"

const Layout = (props: { children?: React.ReactNode }) => (
  <div>
    <NavMenu />
    <Container>{props.children}</Container>
  </div>
)
export default Layout
