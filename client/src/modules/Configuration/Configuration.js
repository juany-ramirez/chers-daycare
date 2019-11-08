import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Nav, Navbar, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import User from "./User/User";
import Kid from "./Kid/Kid";
import Payment from "./Payment/Payment";
import './Configuration.scss'

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
        <div className="nav-options" >
          <Row className="mr-auto">
            <Col>
              <a href="/configuration/user">
                <h4 style={{ color: "black" }}>Usuarios</h4>
              </a>
            </Col>
            <Col>
              <a href="/configuration/kid">
                <h4 style={{ color: "black" }}>Niños</h4>
              </a>
            </Col>
            <Col>
              <a href="/configuration/payment">
                <h4 style={{ color: "black" }}>Pagos</h4>
              </a>
            </Col>
          </Row>
        </div>
        <Switch>
          <Route exact path="/configuration/user" component={User} />
          <Route exact path="/configuration/kid" component={Kid} />
          <Route exact path="/configuration/payment" component={Payment} />
        </Switch>
      </Router>
    </div>
  )
  return content;
}

export default Configuration;
