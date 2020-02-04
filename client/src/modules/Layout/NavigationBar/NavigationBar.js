import React, { useEffect, useState, useMemo } from "react";
import {
  Nav,
  Navbar,
  OverlayTrigger,
  Popover,
  Row,
  Col
} from "react-bootstrap";
import Auth from "../../../utils/auth";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import axios from "axios";
import localization from "moment/locale/es";
import moment from "moment";
import "./NavigationBar.scss";

const NavigationBar = props => {
  const [auth, setAuth] = useState({
    authenticaded: false,
    rol: null,
    id: "",
    names: "",
    last_names: ""
  });

  const [user, setUser] = useState({});

  const [notification, setNotification] = useState({
    open: 0,
    src: "notification-active"
  });

  const value = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  const pushLogin = () => {
    setAuthenticated(false);
    setMenuItems(publicMenuItems);
    props.history.push("/login");
  };

  const publicMenuItems = [
    {
      name: "Sobre Nosotros",
      href: "/"
    },
    {
      name: "Login",
      href: "/login"
    }
  ];

  const parentMenuItems = [
    {
      name: "Sobre Nosotros",
      href: "/"
    },
    {
      name: "Inicio",
      href: "/home"
    }
  ];

  const adminMenuItems = [
    {
      name: "Inicio",
      href: "/home"
    },
    {
      name: "Configuración",
      href: "/configuration/user"
    }
  ];

  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setLoading(true);
    let jwt = Auth.decodeJWT();
    if (jwt)
      setAuth({
        ...auth,
        authenticaded: true,
        rol: jwt.rol,
        id: jwt.sub,
        names: jwt.names,
        last_names: jwt.sub
      });
    if (jwt) {
      getUser(jwt.sub);
      if (jwt.rol === 3) {
        setMenuItems(parentMenuItems);
        setAuthenticated(true);
      } else {
        setMenuItems(adminMenuItems);
        setAuthenticated(true);
      }
    } else {
      setMenuItems(publicMenuItems);
      setAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const getUser = userId => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/users/${userId}`)
      .then(response => {
        let opened = true;
        response.data.data.notifications.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setUser(response.data.data);
        response.data.data.notifications.forEach(notification => {
          if (!notification.opened) opened = false;
        });
        setNotification({
          ...notification,
          src:
            opened === false ? "notification-inactive" : "notification-active"
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const seenNotifications = userId => {
    const notifications = user.notifications.map(notification => {
      return { ...notification, opened: true };
    });
    user.notifications = [...notifications];
    axios
      .put(`${process.env.REACT_APP_NODE_API}/api/auth/users/${user._id}`, user)
      .then(response => {
        setNotification({
          ...notification,
          src: "notification-active"
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  let content = (
    <div className="styles-navigation-bar">
      <AuthenticationContext.Provider value={value}>
        <img
          className="logo-chers-daycare"
          alt="plane-lines"
          href="/"
          src={require("../../../assets/chers-daycare-logo.svg")}
        />
        <Navbar fixed="top" className="justify-content-end" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Row>
            {isAuthenticated && (
              <Nav.Item className="ml-auto">
                <Nav.Link>
                  <OverlayTrigger
                    trigger="click"
                    key="bottom"
                    placement="bottom"
                    overlay={
                      <Popover id={`popover-positioned-bottom`}>
                        <Popover.Title as="h3">{`Notificaciones`}</Popover.Title>
                        {user.notifications && (
                          <Popover.Content
                            style={{ maxHeight: 400 + "px", overflowY: "auto" }}
                          >
                            {user.notifications.length === 0 && (
                              <strong>
                                No tienes ninguna notificación pendiente
                              </strong>
                            )}
                            {user.notifications.map(notification => (
                              <span key={notification._id}>
                                {!notification.opened && (
                                  <strong>{notification.text}</strong>
                                )}
                                {notification.opened && (
                                  <span>{notification.text}</span>
                                )}

                                <p style={{ fontSize: 12 + "px" }}>
                                  {moment(notification.date)
                                    .locale("es", localization)
                                    .fromNow()}
                                </p>
                                <hr></hr>
                              </span>
                            ))}
                          </Popover.Content>
                        )}
                      </Popover>
                    }
                  >
                    <img
                      className="notification-bell"
                      alt="notification-bell"
                      height="20"
                      onClick={() => {
                        if (
                          notification.src === "notification-inactive" &&
                          notification.open % 2 === 1
                        ) {
                          seenNotifications();
                        }
                        setNotification({
                          ...notification,
                          open: notification.open + 1
                        });
                      }}
                      src={require(`../../../assets/icons/${notification.src}.svg`)}
                    />
                  </OverlayTrigger>
                </Nav.Link>
              </Nav.Item>
            )}
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="navbar-control">
                {menuItems.map((item, index) => (
                  <Nav.Item className="text-right" key={index}>
                    <Nav.Link href={item.href}>{item.name}</Nav.Link>
                  </Nav.Item>
                ))}
                {isAuthenticated && (
                  <Nav.Item className="text-right">
                    <Nav.Link
                      onClick={() => {
                        Auth.logout(() => {
                          pushLogin();
                        });
                      }}
                    >
                      Cerrar Sesión
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Navbar.Collapse>
          </Row>

          <svg
            viewBox="0 0 1253 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1176.45 0.766418H1252.12C1249.11 9.80748 1233.32 16.7007 1214.29 16.7007C1195.26 16.7007 1179.47 9.80748 1176.45 0.766418ZM835.539 0.766418H957.866C958.002 1.42596 958.072 2.09299 958.072 2.76643C958.072 16.1503 930.596 27 896.702 27C862.809 27 835.333 16.1503 835.333 2.76643C835.333 2.09299 835.403 1.42596 835.539 0.766418ZM758.787 0.766418H834.459C831.441 9.80748 815.65 16.7007 796.623 16.7007C777.596 16.7007 761.805 9.80748 758.787 0.766418ZM417.873 0.766418H540.199C540.336 1.42596 540.406 2.09299 540.406 2.76643C540.406 16.1503 512.93 27 479.036 27C445.143 27 417.667 16.1503 417.667 2.76643C417.667 2.09299 417.736 1.42596 417.873 0.766418ZM341.12 0.766418H416.792C413.774 9.80748 397.983 16.7007 378.956 16.7007C359.929 16.7007 344.138 9.80748 341.12 0.766418ZM0.206055 0.766418H122.533C122.669 1.42596 122.739 2.09299 122.739 2.76643C122.739 16.1503 95.2627 27 61.3694 27C27.4761 27 0 16.1503 0 2.76643C0 2.09299 0.0695801 1.42596 0.206055 0.766418ZM122.752 0.766418H205.574C205.005 9.60484 186.683 16.7007 164.163 16.7007C141.644 16.7007 123.321 9.60484 122.752 0.766418ZM205.61 0.766418C206.536 9.60484 236.395 16.7007 273.094 16.7007C309.792 16.7007 339.651 9.60484 340.578 0.766418H205.61ZM540.419 0.766418H623.24C622.672 9.60484 604.349 16.7007 581.83 16.7007C559.31 16.7007 540.988 9.60484 540.419 0.766418ZM623.276 0.766418C624.203 9.60484 654.062 16.7007 690.76 16.7007C727.459 16.7007 757.318 9.60484 758.244 0.766418H623.276ZM958.086 0.766418H1040.91C1040.34 9.60484 1022.02 16.7007 999.496 16.7007C976.977 16.7007 958.654 9.60484 958.086 0.766418ZM1040.94 0.766418H1175.91C1174.98 9.60484 1145.13 16.7007 1108.43 16.7007C1071.73 16.7007 1041.87 9.60484 1040.94 0.766418Z"
              fill="#4A4972"
            />
          </svg>
        </Navbar>
      </AuthenticationContext.Provider>
    </div>
  );
  return loading ? "" : content;
};

export default NavigationBar;
