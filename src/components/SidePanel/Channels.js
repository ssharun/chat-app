import React, {Component} from 'react';
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../store/actions';

import {Menu, Icon, Modal, Form, Input, Button, Label} from 'semantic-ui-react';

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        activeChannel: '',
        channels: [],
        channelName: '',
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        modal: false,
        firstLoad: true,
        notifications: []
    };

    componentDidMount(){
        this.addListeners();
    };

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({
                channels: loadedChannels
                },
                () => this.setFirstChannel()
            );
            this.addNotificationsListener(snap.key);
        });
    };

    addNotificationsListener = (channelId) => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        }) 
    };

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);
        if(index !== -1) {
            if(channelId !== currentChannelId) {
                lastTotal = notifications[index].total;
                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        }else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }
        this.setState({notifications});
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({firstLoad: false})
    }

    closeModal = () => this.setState({ modal: false});

    openModal = () => this.setState({modal: true});

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    addChannel = () => {
        const {channelsRef, channelName, user} = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({channelName: ''});
                this.closeModal();
                console.log('channel added');
            })
            .catch(err => {
                console.error(err);
            })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.channelName) {
            this.addChannel();
        }
    };

    setActiveChannel = (channel) => {
        this.setState({ activeChannel: channel.id})
    }

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
    };

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);
        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({
                notifications: updatedNotifications
            })
        }
    };

    getNotificationCount = (channel) => {
        let count = 0;
        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
                count = notification.count;
            }
        });
        if(count > 0) return count;
    }


    displayChannels = (channels) => 
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick = {() => this.changeChannel(channel)}
                name={channel.name}
                active={channel.id === this.state.activeChannel}>
                # {channel.name}
                {this.getNotificationCount(channel) && (
                    <Label color="red">
                        {this.getNotificationCount(channel)}
                    </Label>
                )}
            </Menu.Item>
    ));

    render() {
        const {channels, modal} = this.state;
        return(
            <React.Fragment>
                <Menu.Menu style={{paddingBottom: '2em'}}>
                    <Menu.Item>
                        <span>
                            <Icon
                                name="exchange"/> 
                                Channels
                        </span>
                        ({channels.length}) 
                        <Icon 
                            name="add"
                            onClick={this.openModal}/>
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>
                <Modal
                    basic
                    open={modal}
                    onClose={this.closeModal}>
                    <Modal.Header>Add a channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Input
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                onChange={this.handleChange}/>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="green"
                            inverted
                            onClick={this.handleSubmit}>
                            <Icon name="checkmark"/> Add
                        </Button>
                        <Button
                            color="red"
                            inverted
                            onClick={this.closeModal}>
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
};

export default connect(null, {setCurrentChannel})(Channels);