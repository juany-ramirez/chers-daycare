import React from 'react';
import { Container } from 'react-bootstrap'
import './Layout.scss'

export const Layout = (props) => (
    <div className="styles-layout">
        <Container>
            {props.children}
        </Container>
    </div>
)