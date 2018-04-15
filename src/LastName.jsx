import React, { Component } from 'react';

export default class LastName extends Component {
    render() {
        console.log("rendering LastName ...");
        return <span>{this.props.name}</span>;
    }
}
