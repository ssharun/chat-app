import React, {Component} from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import firebase from '../../firebase';
import md5 from 'md5';

import{Link} from 'react-router-dom';

class Register extends Component {
    state={
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [], 
        loading: false,
        usersRef: firebase.database().ref('users')
    }

    isformValid = () => {
        let errors = [];
        let error;

        if(this.isformEmpty(this.state)) {
            error = { message: 'Fill all fields' };
            this.setState({
                errors: errors.concat(error)
            });
            return false;
        }else if (!this.isPasswordValid(this.state)) {
            error= { message: 'Password is invalid'};
            this.setState({
                errors: errors.concat(error)
            })
            return false;
        }else {
            return true;
        }
    }

    isformEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    };

    isPasswordValid = ({password, passwordConfirmation}) => {
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false
        }else if(password !== passwordConfirmation) {
            return false
        }else {
            return true
        }
    }

    displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.isformValid()) {
            this.setState({
                errors: [],
                loading: true
            })
            console.log(this.state.email);
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('user saved');
                        })
                    })
                    .catch(err => {
                        this.setState({
                            errors: this.state.errors.concat(err),
                            loading: false
                        })
                    })
                })
                .catch(error => {
                    console.log(error)
                    this.setState({
                        errors: this.state.errors.concat(error),
                        loading: false
                    })
                })
        }
    }

    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)
        )
            ?'error'
            :''
    }

    saveUser = (createdUser) => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    render() {
        const {username, email, password, passwordConfirmation, errors, loading} = this.state;
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
                        color="orange" 
                        textAlign="center">
                        <Icon 
                            name="conversation" 
                            color="orange"/>
                        Register Chat
                    </Header>
                    <Form 
                        size="large"
                        onSubmit={this.handleSubmit}>
                        <Segment 
                            stacked>
                            <Form.Input 
                                fluid 
                                name="username" 
                                icon="user" 
                                iconPosition="left"
                                placeholder="Username" 
                                value={username}
                                onChange={this.handleChange} 
                                type="text"/>
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
                            <Form.Input 
                                fluid 
                                name="passwordConfirmation" 
                                className={this.handleInputError(errors, 'passwordConfirmation')}
                                icon="repeat" 
                                iconPosition="left"
                                placeholder="Password Confirmation" 
                                value={passwordConfirmation}
                                onChange={this.handleChange} 
                                type="password"/>
                            <Button
                                className={loading? 'loading' : ''}
                                disabled={loading}
                                color="orange"
                                fluid
                                size='large'>
                                Submit
                            </Button>
                            <Message>Already a user? <Link to='/login'>Login</Link></Message>
                        </Segment>
                    </Form>
                    {errorMessage}
                </Grid.Column>
            </Grid>
        )
    }
};

export default Register;