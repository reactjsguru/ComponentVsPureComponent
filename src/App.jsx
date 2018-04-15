import React, { Component, Fragment } from 'react';
import FirstName from './FirstName.jsx';
import LastName from './LastName.jsx';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: Math.random(),
            lastname: Math.random()
        };
    }

    componentDidMount() {
        const id = setInterval(() => this.setState({ firstName: Math.random() }), 2000);
        setTimeout(() => clearInterval(id), 6000);
    }

    render() {
        return (
            <Fragment>
                <FirstName name={this.state.firstName} />
                <LastName name={this.state.lastname} />
            </Fragment>
        );
    }
}
