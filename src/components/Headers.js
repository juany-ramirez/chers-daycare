import React from 'react';
import styled from 'styled-components'

const Styles = styled.div`
    color: ${ props => props.color ? props.color : '#4A4972'};
    .primary-font {
        font-family: 'Gochi Hand', cursive;
    }
    .secondary-font {
        font-family: 'Montserrat', sans-serif;
    }
    .primary-large-font {
        font-size: 64px;
    }
    .primary-medium-font {
        font-size: 25px;
    }
    .primary-small-font {
        font-size: 18px;
    }
    .secondary-large-font {
        font-size: 20px;
    }
    .secondary-medium-font {
        font-size: 18px;
    }
    .secondary-small-font {
        font-size: 15px;
    }
`

export const PrimaryHeaderLarge = (props) => (
    <Styles color={props.color}>
        <h1 className="primary-font primary-large-font">{props.title}</h1>
    </Styles>
)

export const PrimaryHeaderMedium = (props) => (
    <Styles color={props.color}>
        <h1 className="primary-font primary-medium-font">{props.title}</h1>
    </Styles>
)

export const PrimaryHeaderSmall = (props) => (
    <Styles color={props.color}>
        <h1 className="primary-font primary-small-font">{props.title}</h1>
    </Styles>
)

export const SecondaryHeaderLarge = (props) => (
    <Styles color={props.color}>
        <h1 className="secondary-font secondary-large-font">{props.title}</h1>
    </Styles>
)

export const SecondaryHeaderMedium = (props) => (
    <Styles color={props.color}>
        <h1 className="secondary-font secondary-medium-font">{props.title}</h1>
    </Styles>
)

export const SecondaryHeaderSmall = (props) => (
    <Styles color={props.color}>
        <h1 className="secondary-font secondary-small-font">{props.title}</h1>
    </Styles>
)