import React, {Component} from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import firebase from '../../firebase';

import{Link} from 'react-router-dom';

class Login extends Component {
    state={
        email: "",
        password: "",
        errors: [], 
        loading: false
    }

    

    displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.isformValid(this.state)) {
            this.setState({
                errors: [],
                loading: true
            });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                })
                .catch(err => {
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    })
                })
        }
    }

    isformValid = ({email, password}) => email && password;

    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)
        )
            ?'error'
            :''
    }

    render() {
        const { email, password, errors, loading} = this.state;
        let errorMessage = null;
        if(errors.length > 0) {
            errorMessage = (
                <Message error>
                    <h3>Error</h3>
                    {this.displayErrors(errors)}
                </Message>
            )
        }
        return(
            <Grid 
                textAlign="center" 
                verticalAlign="middle"
                className="app">
                <Grid.Column 
                    style={{maxWidth: 450}}>
                    <Header 
                        as="h1" 
                        icon 
                        color="violet" 
                        textAlign="center">
                        <Icon 
                            name="talk" 
                            color="violet"/>
                        Login to Chat
                    </Header>
                    <Form 
                        size="large"
                        onSubmit={this.handleSubmit}>
                        <Segment 
                            stacked>
                            <Form.Input 
                                fluid 
                                className={this.handleInputError(errors, 'email')}
                                name="email" 
                                icon="mail" 
                                iconPosition="left"
                                placeholder="Email" 
                                value={email}
                                onChange={this.handleChange} 
                                type="email"/>
                            <Form.Input 
                                fluid 
                                name="password" 
                                className={this.handleInputError(errors, 'password')}
                                icon="lock" 
                                iconPosition="left"
                                placeholder="Password" 
                                value={password}
                                onChange={this.handleChange} 
                                type="password"/>
                            <Button
                                className={loading? 'loading' : ''}
                                disabled={loading}
                                color="violet"
                                fluid
                                size='large'>
                                Submit
                            </Button>
                            <Message>Don't have an account? <Link to='/register'>Register</Link></Message>
                        </Segment>
                    </Form>
                    {errorMessage}
                </Grid.Column>
            </Grid>
        )
    }
};

export default Login;