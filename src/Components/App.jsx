import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Chatroom from './Chatroom';
import { animals, colors } from '../../data';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      hasUsername: false,
    };
    this.updateUsername = this.updateUsername.bind(this);
    this.generateName = this.generateName.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  generateName() {
    const random = (list) => list[Math.floor(Math.random() * list.length)];
    this.setState({ username: random(colors).concat(random(animals)) });
  }

  updateUsername(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  redirect(e) {
    e.preventDefault();
    this.setState({ hasUsername: true });
  }

  render() {
    const { hasUsername, username } = this.state;
    return (
      <>
        {
        !hasUsername && (
          <>
            <Jumbotron className="jumbotron">
              <h1> Welcome To Babbler!</h1>
              <p>
                This is a chatroom application that is free to use and built with react-bootstrap.
                Create your personal username or generate a random one and start chatting!
              </p>
            </Jumbotron>
            <Form onSubmit={this.redirect}>
              <Form.Group className="username">
                <Form.Label>Create Username</Form.Label>
                <InputGroup>
                  <Form.Control
                    required
                    type="text"
                    name="username"
                    value={username}
                    placeholder="Enter Username"
                    onChange={this.updateUsername}
                  />
                  <InputGroup.Append>
                    <Button type="button" onClick={this.generateName}>Generate Random</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              {/* <Form.Group className="joinRoom">
                <Form.Label>Join Room</Form.Label>
                <InputGroup>
                  <DropdownButton title="Rooms">
                    <Dropdown.Item>Test</Dropdown.Item>
                  </DropdownButton>
                </InputGroup>
              </Form.Group>
              <Form.Group className="createRoom">
                <Form.Label>Create a Room</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Room Name</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    placeholder="Enter Room Name"
                  />
                </InputGroup>
              </Form.Group> */}
              <Form.Group>
                <Button type="submit" onSubmit={this.redirect}>Start Chatting</Button>
              </Form.Group>
            </Form>
          </>
        )
      }
        {
        hasUsername && <Chatroom username={username} />
      }
      </>
    );
  }
}
