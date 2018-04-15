import React, { Component } from 'react';

export default class FirstName extends Component {
    render() {
        console.log('rendering FirstName ...');
        return <span>{this.props.name}</span>;
    }
}
