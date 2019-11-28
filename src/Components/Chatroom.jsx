/* eslint-disable react/no-array-index-key */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Navbar from 'react-bootstrap/Navbar';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import socketIOClient from 'socket.io-client';
import styled from 'styled-components';

function renderTooltip(props) {
  return <Tooltip {...props}>Click To Add A New Room</Tooltip>;
}

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      endpoint: 'http://127.0.0.1:3000',
      text: '',
      room: '',
      allRooms: [],
      typing: false,
      currentRoom: 'General',
    };
    this.updateText = this.updateText.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.appendMessage = this.appendMessage.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.updateRooms = this.updateRooms.bind(this);
    this.switchRoom = this.switchRoom.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.showTyping = this.showTyping.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const { username } = this.props;
    this.socket = socketIOClient(endpoint);
    this.socket.on('update rooms', this.updateRooms);
    this.socket.on('append message', this.appendMessage);
    this.socket.on('get history', this.getHistory);
    this.socket.on('typing', this.showTyping);
    this.socket.emit('add user', username);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  getHistory(messages) {
    this.setState({ allMessages: messages });
  }

  updateRooms(data) {
    this.setState({ allRooms: data });
  }

  switchRoom(e) {
    const { currentRoom } = this.state;
    if (e.target.innerHTML === currentRoom) return;
    this.socket.emit('switch room', e.target.innerHTML);
    this.setState({ allMessages: [], currentRoom: e.target.innerHTML });
  }

  appendMessage(msg) {
    const { allMessages } = this.state;
    this.setState({ allMessages: [...allMessages, msg] });
  }

  handleKeyPress() {
    this.socket.emit('typing');
  }

  scrollToBottom() {
    this.myRef.scrollIntoView({ behavior: 'smooth' });
  }

  showTyping(data) {
    this.setState({ typing: data }, () => {
      setTimeout(() => {
        this.setState({ typing: false });
      }, 1000);
    });
  }

  createRoom(e) {
    e.preventDefault();
    const { room } = this.state;
    if (!room) return;
    this.socket.emit('create room', room);
    this.setState((prevState) => ({ room: '', allMessages: [], currentRoom: prevState.room }));
  }

  sendMessage(event) {
    event.preventDefault();
    const { text } = this.state;
    const { username } = this.props;
    if (text === '') return;
    this.socket.emit('append message', { username, text });
    this.setState({ text: '' });
  }

  updateText(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      text, room, allMessages, allRooms, typing, currentRoom,
    } = this.state;
    const { username } = this.props;
    return (
      <>
        <Navbar bg="dark" variant="dark" style={{ height: '10vh', position: 'relative' }}>
          <Title> Babbler </Title>
          <Navbar.Text style={{ position: 'fixed', right: '1%' }}>
            Signed in as: <b>{username}</b>
          </Navbar.Text>
        </Navbar>
        <Container>
          <Rooms>
            <ListGroup style={{ flexGrow: 1, overflow: 'auto' }}>
              {
                allRooms.map((current, index) => {
                  let active = current === currentRoom;
                  return <Room active={active} key={index} onClick={this.switchRoom}>{current}</Room>;
                })
              }
            </ListGroup>
            <CreateRoom>
              <Form.Control
                type="text"
                placeholder="Room"
                name="room"
                onChange={this.updateText}
                value={room}
                autoComplete="off"
              />
              <InputGroup.Append>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <Button variant="success" onClick={this.createRoom}>Add</Button>
                </OverlayTrigger>
              </InputGroup.Append>
            </CreateRoom>
          </Rooms>
          <Chat>
            <Messages>
              {
                allMessages.map((message, index) => {
                  const primary = username === message.username;
                  if (message.username === username) return <div><Message primary={primary} key={index}>{message.text}</Message></div>;
                  return <div><Message primary={primary} key={index}>{`${message.username}: ${message.text}`}</Message></div>;
                })
              }
              {
                typing && <div style={{ fontStyle: 'italic' }}>{typing}</div>
              }
              <div ref={(el) => { this.myRef = el; }} />
            </Messages>
            <Draft onSubmit={this.sendMessage}>
              <Form.Control
                autoComplete="off"
                name="text"
                value={text}
                type="text"
                placeholder="Enter Text"
                onChange={this.updateText}
                onKeyPress={this.handleKeyPress}
              />
            </Draft>
          </Chat>
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Chat = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  height: 90vh;
  border: 4px solid black;
`;

const Draft = styled(Form)`
  align-self: flex-end;
  width: 100%;
`;

const Rooms = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 90vh;
  border: 4px solid black;
`;

const CreateRoom = styled(InputGroup)`
  display: flex;
  align-self: flex-end;
  width: 100%;
`;

const Messages = styled.div`
  overflow: auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const Message = styled.div`
  background-color: ${(props) => (props.primary ? 'DodgerBlue' : 'LimeGreen')};
  float: ${(props) => (props.primary ? 'right' : 'left')};
  border-radius: 5px;
  display: block;
  padding: 5px;
  box-shadow: 5px 5px 5px 5px;
  margin: 2px;
`;

const Room = styled(ListGroup.Item)`
  cursor: pointer;
  background-color: ${(props) => (props.active ? 'DodgerBlue' : 'White')};
  transition: 0.5s all ease-out;

  &:hover {
    opacity: .7;
    background-color: navy;
    color: white;
  }
`;

const Title = styled(Navbar.Brand)`
    font-size: 28px;
    position: fixed;
    left: 50%;
    font-weight: bold;
`;
