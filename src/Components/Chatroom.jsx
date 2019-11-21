/* eslint-disable react/no-array-index-key */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import socketIOClient from 'socket.io-client';
import styled from 'styled-components';

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      endpoint: 'http://127.0.0.1:3000',
      text: '',
      room: '',
      allRooms: [],
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

  createRoom(e) {
    
  }

  sendMessage(event) {
    event.preventDefault();
    const { text } = this.state;
    const { username } = this.props;
    this.socket.emit('append message', username.concat(' : ', text));
    this.setState({ text: '' });
  }

  updateText(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { text, allMessages, allRooms } = this.state;
    return (
      <Container>
        <Rooms>
          <RoomsTitle>Rooms</RoomsTitle>
          <ListGroup style={{ flexGrow: 1 }}>
            {
              allRooms.map((room) => <ListGroup.Item>{room}</ListGroup.Item>)
            }
          </ListGroup>
          <CreateRoom>
            <Form.Control
              style={{ flex: 3 }}
              type="text"
              placeholder="Enter Room Name"
              name="room"
              onChange={this.updateText}
            />
            <InputGroup.Append style={{ flex: 1 }}>
              <Button>Add</Button>
            </InputGroup.Append>
          </CreateRoom>
        </Rooms>
        <Chat>
          <Title>Babbler</Title>
          <ListGroup style={{ flexGrow: 1 }}>
            {
              allMessages.map((message, index) => <ListGroup.Item key={index}>{message}</ListGroup.Item>)
            }
          </ListGroup>
          <Draft onSubmit={this.sendMessage}>
            <Form.Group controlId="chatTextBox">
              <Form.Control name="text" value={text} type="text" placeholder="Enter Text" onChange={this.updateText} />
            </Form.Group>
          </Draft>
        </Chat>
      </Container>
    );
  }
}

const Title = styled.h1`
  color: blueviolet;
  text-align: center;
  border-bottom: 4px solid silver;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Chat = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 4px solid silver;
`;

const Draft = styled(Form)`
  align-self: flex-end;
  width: 100%;
`;

const Rooms = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 4px solid black;
`;

const RoomsTitle = styled.h1`
  text-align: center;
  color: purple;
  border-bottom: 4px solid black;
`;

const CreateRoom = styled(InputGroup)`
  display: flex;
  align-self: flex-end;
  width: 100%;
`;
