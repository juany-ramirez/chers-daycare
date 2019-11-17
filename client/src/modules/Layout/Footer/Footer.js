import React from 'react';
import { Navbar } from 'react-bootstrap';
import './Footer.scss'

export const Footer = (props) => (
    <div className="styles-footer">
        <Navbar sticky="bottom" className="text-right" expand="lg">
            &copy; {new Date().getFullYear()} Cher's Daycare and Learning Center
        </Navbar>
    </div>
)