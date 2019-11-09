import React from 'react';
import styled from 'styled-components'
import { Button, Spinner } from 'react-bootstrap';

const Styles = styled.div`
    .styles-button {
        background-color: ${ props => props.bg ? props.bg : '#4A4972'};
        color: ${ props => props.color ? props.color : '#D5E4F2'};
        border: none;
        margin-right: 10px;
        :active {
            background-color: rgba(0,0,0,.2) !important;
        }
        :focus {
            border: none !important;
        }
    }
    .round-buttons {
        display: flex;
        margin: auto;
        svg {
            margin: auto;
        }
    }
`

export const DButton = (props) => (
    <Styles color={props.color} bg={props.bg}>
        {(!props.loading || props.loading === "") && (
            <Button
                className="styles-button"
                disabled={props.disabled}
                type={props.type}
                onClick={() => { if(!props.type) props.handleClick() }}
            >
                {props.title}
            </Button>
        )}
        {props.loading === "loading" && (
            <Button 
                className="styles-button"
                disabled>
                <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
                Cargando...
            </Button>
        )}
    </Styles>
)

export const DeleteRoundButton = (props) => (
    <Styles>
        <Button
            onClick={() => { props.handleClick() }}
            className="round-buttons"
            style={{
                marginLeft: "4px",
                marginRight: "4px",
                borderRadius: "50%",
                width: "48px",
                height: "48px"

            }}
            variant="danger"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
            >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        </Button>
    </Styles>
)

export const EditRoundButton = (props) => (
    <Styles>
        <Button
            onClick={() => { props.handleClick() }}
            className="round-buttons"
            style={{
                marginLeft: "4px",
                marginRight: "4px",
                borderRadius: "50%",
                width: "48px",
                height: "48px"
            }}
            variant="info"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
            >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        </Button>
    </Styles>
)