import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Nav, Navbar, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import User from "./User/User";
import Kid from "./Kid/Kid";

const Configuration = props => {

  const [value, setValue] = useState(1);
  const handleChange = val => {
    setValue(val);
    if (val === 1) {
      props.history.push("/configuration/user");
    } else if (val === 2) {
      props.history.push("/configuration/kid");
    }
  }

  let content = (
    <div className="configuration-styles text-center">
      <Router>
        <Navbar bg="warning" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link href="/configuration/user">
              <h4 style={{color:"black"}}>Usuarios</h4>
            </Nav.Link>
            <Nav.Link href="/configuration/kid">
              <h4 style={{color:"black"}}>Niños</h4>
            </Nav.Link>
            <Nav.Link href="/configuration/payment">
              <h4 style={{color:"black"}}>Pagos</h4>
            </Nav.Link>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/configuration/user" component={User} />
          <Route exact path="/configuration/kid" component={Kid} />
          {/* <Route path="/payment" component={Payment}/> */}
        </Switch>
      </Router>
    </div>
  )
  return content;
}

export default Configuration;
