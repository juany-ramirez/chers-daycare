import React from 'react'
import Login from './Login';

const Authentication = props => {
    
    let content = (
        <Login history={props.history}/>
    )
    return content;
}

export default Authentication;