import React from 'react';
import { Card, Media, InputGroup, Button, FormControl, DropdownButton, Dropdown, Col, Row, Image } from 'react-bootstrap'
import styled from 'styled-components'
import { PrimaryHeaderSmall, TextSmall } from './Headers'
import '../index.scss';

const Styles = styled.div`
    color: #4A4972;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    .card {
        border: 5px solid #4A4972;
        background-color: #D5E4F2;
        border-radius: 25px;
    }
    .card-header {
        border-bottom: 1px solid #4A4972;
        background-color: rgba(213,228,242, 0.8);
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
    }
    .card-footer {
        border-top: 1px solid #4A4972;
        background-color: rgba(213,228,242, 0.8);
        border-bottom-left-radius: 25px;
        border-bottom-right-radius: 25px;
        padding: 0px;
        position: relative;
        display: inline-block;
        color: #4A4972;
        svg {
            fill: currentColor;
        }
    }
    .input-group {
        margin: 0px;
        margin-bottom: 0px !important;
        input {
            font-family: 'Gochi Hand', cursive;
            font-size: 18px;
            background-color: rgba(213,228,242, 0.8);
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            &:focus {
                background-color: #F2D95E;
            }
        }
        .input-group-append, button {
            border: none;
            border-bottom-right-radius: 20px;
            border-top-right-radius: 0px;

        }
    }
    .media-body {
        text-align: left;
    }
    .dropdown-toggle {
        background-color: #F2D95E;
        border: none;
        &:active {
            background-color: #F2B441;
            border: none;
        }
    }
    .dropdown-menu {
        background-color: #F2D95E;
        .dropdown-item {
            color: #4A4972;
            &:hover {
                background-color: #F2B441;
            }
        }
    }
    .show .dropdown-toggle {
        background-color: #F2D95E;
        border: none;
    }
    .daycare-like-segment {
        color: #F23C3C;
        svg {
            fill: currentColor;
            margin-left: 20px;
            margin-right: 20px;
            @media only screen and (max-width : 576px) {
                margin-left: 0px;
                margin-right: 10px;
            }
        }
    }
    img {
        margin-bottom: 5vh;
    }
    .daycare-center {
        margin: auto;
    }
`
export const Post = (props) => (
    <Styles>
        <Card className="daycare-center">
            <Card.Header>
                <Row>
                    <Col lg={11} xs={10}>
                        <PrimaryHeaderSmall className='daycare-card-header' title='2 days ago' color='#6c757d'/>
                    </Col>
                    <Col lg={1} xs={2}>
                        <DropdownButton alignRight size="sm" title="" id="dropdown-menu-align-right">
                            <Dropdown.Item eventKey="1">Editar Publicación</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="4">Borrar publicación</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Image src={require('../assets/40674424_1088390404662326_1735908996587454464_n.jpg')}fluid />
                <Media>
                    <div className="daycare-like-segment">
                        <TextSmall title="Likes: 5"/>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>
                    </div>
                    <Media.Body>
                        <p>
                        <br/>
                        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                        ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                        tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                        Donec lacinia congue felis in faucibus.
                        </p>
                    </Media.Body>
                </Media>
                <hr></hr>
                <Row>
                    <Col xs={4}>
                        <b><TextSmall title='Maria Rodriguez' color='#6c757d'/></b>
                        <TextSmall title='5h' color='#6c757d'/>
                    </Col>
                    <Col xs={8}>
                        <TextSmall title='Cras purus amor, vestibulum in vulputate at, tempus viverra turpis.' color='#6c757d'/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <b>
                            <TextSmall title='Mario Lopez' color='#6c757d'/>
                        </b>
                        <TextSmall title='2h' color='#6c757d'/>
                    </Col>
                    <Col xs={8}>
                        <TextSmall title='Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congueCras purus odio, vestibulum in vulputate at, tempus viverra turpis.' color='#6c757d'/>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer className="text-muted">
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Agregar comentario..."
                        aria-label="Agregar comentario..."
                        aria-describedby="basic-addon2"
                        />
                    <InputGroup.Append>
                        <Button disabled variant="outline-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Card.Footer>
        </Card>
    </Styles>
)