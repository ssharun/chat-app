import React, {Component} from "react";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";

class MessageForm extends Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: []
  };


  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message
    };
    return message;
    
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message.trim()) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  handleAdd = (event) => {
    if(event.keyCode === 13 ) {
      this.sendMessage()
    }
  }

  render() {
    const {  errors, message, loading } = this.state;
    const { channelName } = this.props;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7em" }}
          onKeyDown={this.handleAdd}
          label={
            <Button
              onClick={this.sendMessage}
              disabled={loading}
              color="green"
              content="Send"
              labelPosition="right"
              icon="edit"
            />
          }
          labelPosition="right"
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder={"Message " + channelName}
        />
        
      </Segment>
    );
  }
}

export default MessageForm;
