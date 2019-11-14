/* eslint-disable react/no-array-index-key */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import socketIOClient from 'socket.io-client';
import styled from 'styled-components';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      endpoint: 'http://127.0.0.1:3000',
      text: '',
    };
    this.updateText = this.updateText.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.appendMessage = this.appendMessage.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);
    this.socket.on('append message', this.appendMessage);
  }

  appendMessage(msg) {
    const { allMessages } = this.state;
    this.setState({ allMessages: [...allMessages, msg] });
  }

  sendMessage(event) {
    const { text } = this.state;
    event.preventDefault();
    this.socket.emit('append message', text);
    this.setState({ text: '' });
  }

  updateText(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    const { text, allMessages } = this.state;
    return (
      <Chat>
        <Title>Babbler</Title>
        <ListGroup style={{ flexGrow: 1 }}>
          {
            allMessages.map((message, index) => <ListGroup.Item key={index}>{message}</ListGroup.Item>)
          }
        </ListGroup>
        <Draft onSubmit={this.sendMessage}>
          <Form.Group controlId="chatTextBox">
            <Form.Control value={text} type="text" placeholder="Enter Text" onChange={this.updateText} />
          </Form.Group>
        </Draft>
      </Chat>
    );
  }
}

const Title = styled.h1`
  color: blueviolet;
  align-self: center;
`;

const Chat = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Draft = styled(Form)`
  align-self: flex-end;
  width: 100vw;
`;
