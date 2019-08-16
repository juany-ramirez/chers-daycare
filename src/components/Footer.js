import React from 'react';
import { Navbar } from 'react-bootstrap'
import styled from 'styled-components'
import '../index.scss';

const Styles = styled.div`
    .navbar{
        background-color: #4A4972;
        svg{
            height: auto;
            width:100vw;
            position: fixed;
            top:50px;
            left:0px;
            .shadow {
                -webkit-filter: drop-shadow( 0 10px 10px -5px rgba(0, 0, 0, .7));
                filter: drop-shadow( 0 10px 10px -5px rgba(0, 0, 0, .7));
            }
        }
    }
    @media (max-width: 768px) { 
        .show {
            padding-top: 10px;
        }
    }
    .navbar-brand, .nav-item .nav-link{        
        font-family: 'Montserrat', sans-serif;
        font-size: 18px;
        color: #F2B441;
        &:hover {
            color: #F23C3C;
            font-weight: bold;
        }
    }
`

export const Footer = (props) => (
    <Styles>
        {/* <svg viewBox="0 0 1253 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M75.6719 27L0 27C3.01758 17.9589 18.8087 11.0657 37.8358 11.0657C56.8629 11.0657 72.6542 17.9589 75.6719 27ZM416.586 27L294.259 27C294.123 26.3405 294.053 25.6734 294.053 25C294.053 11.6161 321.529 0.766418 355.422 0.766418C389.316 0.766418 416.792 11.6161 416.792 25C416.792 25.6734 416.722 26.3405 416.586 27ZM493.338 27L417.666 27C420.684 17.9589 436.475 11.0657 455.502 11.0657C474.529 11.0657 490.32 17.9589 493.338 27ZM834.252 27L711.925 27C711.789 26.3405 711.719 25.6734 711.719 25C711.719 11.6161 739.195 0.766418 773.089 0.766418C806.982 0.766418 834.458 11.6161 834.458 25C834.458 25.6734 834.389 26.3405 834.252 27ZM911.005 27L835.333 27C838.351 17.9589 854.142 11.0657 873.169 11.0657C892.196 11.0657 907.987 17.9589 911.005 27ZM1251.92 27L1129.59 27C1129.46 26.3405 1129.39 25.6734 1129.39 25C1129.39 11.6161 1156.86 0.766418 1190.76 0.766418C1224.65 0.766418 1252.12 11.6161 1252.12 25C1252.12 25.6734 1252.06 26.3405 1251.92 27ZM1129.37 27L1046.55 27C1047.12 18.1616 1065.44 11.0657 1087.96 11.0657C1110.48 11.0657 1128.8 18.1616 1129.37 27ZM1046.52 27C1045.59 18.1616 1015.73 11.0657 979.031 11.0657C942.333 11.0657 912.474 18.1616 911.547 27L1046.52 27ZM711.706 27L628.885 27C629.453 18.1616 647.776 11.0657 670.295 11.0657C692.815 11.0657 711.137 18.1616 711.706 27ZM628.849 27C627.922 18.1616 598.063 11.0657 561.365 11.0657C524.666 11.0657 494.807 18.1616 493.88 27L628.849 27ZM294.039 27L211.218 27C211.786 18.1616 230.109 11.0657 252.628 11.0657C275.148 11.0657 293.471 18.1616 294.039 27ZM211.182 27L76.214 27C77.1406 18.1616 107 11.0657 143.698 11.0657C180.397 11.0657 210.256 18.1616 211.182 27Z" fill="#4A4972"/>
        </svg> */}
        <Navbar sticky="bottom" expand="lg">
            <Navbar.Brand href="/">
                Copyright 
            </Navbar.Brand>
        </Navbar>
    </Styles>
)