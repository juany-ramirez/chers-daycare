import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'
import styled from 'styled-components'
import { PrimaryHeaderMedium } from './Headers'

const Styles = styled.div`
    color: #4A4972;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    background-color: #F2D95E;
    position:absolute;
    left:0px;
    top:0px;
    width:99vw;
    min-height:300px;
    padding-top:100px;
    padding-bottom:8px;
    margin-bottom: 20px;
    textarea {
        border-radius: 8px;
        border:none;
        color: #4A4972;
        height:32px;
        min-height:32px;
        @media only screen and (min-width : 992px) {
            min-width: 800px;
        }
        @media only screen and (max-width : 991.98px) {
            min-width: 100%;
        }
        &:focus {
            min-height:58px;
        }
    }
    button {
        background-color: #F23C3C;
        border: none;
    }
    .form-group {
        font-size:15px;
        input {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            background-color: #F2B441;
            border:none;
            max-width: 500px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
    }    
`
export const NewPost = (props) => (
    <Styles>
        <Container className="text-center">
            <PrimaryHeaderMedium title="Nueva Publicación"></PrimaryHeaderMedium>
            <Row>
                <Col xs={12}>
                    <textarea placeholder="Descripcion..." aria-label="Descripcion..."></textarea>
                </Col>
            </Row>
             <Row>
                 <Col xs={12}>
                    <div className="form-group">
                        <input type="file" className="form-control-file" id="exampleFormControlFile1"></input>
                    </div>
                 </Col>
             </Row>
             <Row>
                 <Col xs={12}>
                    <Button variant="danger">Publicar</Button>
                 </Col>
             </Row>
        </Container>
    </Styles>
)