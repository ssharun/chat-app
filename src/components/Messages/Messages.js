import React, {Component} from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    searchTerm: "",
    searchResults: []
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.messagesEnd) {
      this.scrollToBottom();
    }
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: 'smooth'});
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
  ));

  displayChannelName = channel => channel? `# ${channel.name}`: '';

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        (message.user.name && message.user.name.match(regex))
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
  };

  render() {
    const { 
      messagesRef, 
      messages, 
      channel, 
      user,
      searchTerm,
      searchResults
    } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader 
          channelName={this.displayChannelName(channel)}
          handleSearchChange={this.handleSearchChange}
        />

        <Segment>
          <Comment.Group className="messages">
            {
              searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)
            }
            <div ref={node => (this.messagesEnd = node)}></div>
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          channelName={this.displayChannelName(channel)}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
