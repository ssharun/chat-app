import React, {Component} from "react";
import { Header, Segment, Input } from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {
    const {
      channelName,
      handleSearchChange
    } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
          </span>
        </Header>
        <Header floated="right">
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
