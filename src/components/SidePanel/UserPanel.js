import React, {Component} from 'react';
import firebase from '../../firebase';

import {Grid, Header, Dropdown, Image} from 'semantic-ui-react';

class UserPanel extends Component {

    state={
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: (<span>Signed in as  { this.state.user.displayName}</span>),
            disabled: true
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ];

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out'))
    }

    render() {
        const {user} = this.state;
        return (
            <Grid
                style={{background: '#07032E'}}>
                <Grid.Column>
                    <Grid.Row
                        style={{padding: '1.2em', margin: 0}}>
                        <Header
                            inverted
                            floated="left"
                            as="h2">
                            <Header.Content>
                                XYZ Company
                            </Header.Content>
                        </Header>
                    </Grid.Row>
                    <Header
                        style={{padding: '0.25em'}}
                        as="h4"
                        inverted>
                        <Image 
                            src={user.photoURL}
                            spaced="right"
                            avatar/>
                        <Dropdown
                            trigger={
                                <span>{user.displayName}</span>
                            }
                            options={this.dropdownOptions()}/>
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
};

export default UserPanel;