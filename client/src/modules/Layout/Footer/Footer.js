import React from 'react';
import { Navbar } from 'react-bootstrap';
import './Footer.scss'

export const Footer = (props) => (
    <div className="styles-footer">
        <Navbar sticky="bottom" expand="lg">
            <Navbar.Brand href="/">
                Copyright 
            </Navbar.Brand>
        </Navbar>
    </div>
)