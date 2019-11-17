import React, { useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Router, Route } from "react-router-dom";
import './NavigationBar.scss';
import Auth from '../../../auth';

const NavigationBar = (props) => {
    console.log(props);

    const pushLogin = () => {
        console.log(props);
        setAuthenticated(false);
        setMenuItems(publicMenuItems);
        props.history.push('/login');
    }

    const publicMenuItems = [
        {
            name: 'Sobre Nosotros',
            href: '/'
        },
        {
            name: 'Login',
            href: '/login'
        }
    ];

    const adminMenuItems = [
        {
            name: 'Inicio',
            href: '/home'
        },
        {
            name: 'Configuración',
            href: '/configuration/user'
        }
    ]

    const firebaseMenuItems = [
        {
            name: 'Sobre Nosotros',
            href: '/'
        },
    ]

    const [menuItems, setMenuItems] = useState([]);
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (Auth.isAuthenticated()) {
            setMenuItems(adminMenuItems);
            setAuthenticated(true);
        } else {
            setMenuItems(firebaseMenuItems);
            setAuthenticated(false);
        }
    }, Auth.isAuthenticated());

    let content = (
        <div className="styles-navigation-bar">
            <img
                className="logo-chers-daycare"
                alt="plane-lines"
                href="/"
                src={require("../../../assets/chers-daycare-logo.svg")}
            />
            <Navbar fixed="top" expand="lg">
                <Navbar.Brand>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto navbar-control">
                        <Nav.Item>
                            <Nav.Link></Nav.Link>
                        </Nav.Item>
                        {menuItems.map((item, index) => (
                            <Nav.Item key={index}>
                                <Nav.Link href={item.href} >{item.name}</Nav.Link>
                            </Nav.Item>
                        ))}
                        {isAuthenticated && (
                            <Nav.Item><Nav.Link onClick={() => {
                                Auth.logout(() => {
                                    pushLogin()
                                })
                            }}>Cerrar Sesión</Nav.Link></Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
                <svg viewBox="0 0 1253 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1176.45 0.766418H1252.12C1249.11 9.80748 1233.32 16.7007 1214.29 16.7007C1195.26 16.7007 1179.47 9.80748 1176.45 0.766418ZM835.539 0.766418H957.866C958.002 1.42596 958.072 2.09299 958.072 2.76643C958.072 16.1503 930.596 27 896.702 27C862.809 27 835.333 16.1503 835.333 2.76643C835.333 2.09299 835.403 1.42596 835.539 0.766418ZM758.787 0.766418H834.459C831.441 9.80748 815.65 16.7007 796.623 16.7007C777.596 16.7007 761.805 9.80748 758.787 0.766418ZM417.873 0.766418H540.199C540.336 1.42596 540.406 2.09299 540.406 2.76643C540.406 16.1503 512.93 27 479.036 27C445.143 27 417.667 16.1503 417.667 2.76643C417.667 2.09299 417.736 1.42596 417.873 0.766418ZM341.12 0.766418H416.792C413.774 9.80748 397.983 16.7007 378.956 16.7007C359.929 16.7007 344.138 9.80748 341.12 0.766418ZM0.206055 0.766418H122.533C122.669 1.42596 122.739 2.09299 122.739 2.76643C122.739 16.1503 95.2627 27 61.3694 27C27.4761 27 0 16.1503 0 2.76643C0 2.09299 0.0695801 1.42596 0.206055 0.766418ZM122.752 0.766418H205.574C205.005 9.60484 186.683 16.7007 164.163 16.7007C141.644 16.7007 123.321 9.60484 122.752 0.766418ZM205.61 0.766418C206.536 9.60484 236.395 16.7007 273.094 16.7007C309.792 16.7007 339.651 9.60484 340.578 0.766418H205.61ZM540.419 0.766418H623.24C622.672 9.60484 604.349 16.7007 581.83 16.7007C559.31 16.7007 540.988 9.60484 540.419 0.766418ZM623.276 0.766418C624.203 9.60484 654.062 16.7007 690.76 16.7007C727.459 16.7007 757.318 9.60484 758.244 0.766418H623.276ZM958.086 0.766418H1040.91C1040.34 9.60484 1022.02 16.7007 999.496 16.7007C976.977 16.7007 958.654 9.60484 958.086 0.766418ZM1040.94 0.766418H1175.91C1174.98 9.60484 1145.13 16.7007 1108.43 16.7007C1071.73 16.7007 1041.87 9.60484 1040.94 0.766418Z" fill="#4A4972" />
                </svg>
            </Navbar>

        </div >
    );
    return content;
}

export default NavigationBar;