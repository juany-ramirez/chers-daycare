import React from 'react';
import { Container } from 'react-bootstrap'
import styled from 'styled-components'

const Styles = styled.div`
    padding-top:110px;
    @media (max-width: 768px) { 
        padding-top:70px;
    }
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    background-color: $Chers-DayCare-5-hex;
`
export const Layout = (props) => (
    <Styles>
        <Container>
            {props.children}
        </Container>
    </Styles>
)