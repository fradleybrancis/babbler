import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Chatroom from './Chatroom';
import { animals } from '../../data';

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
    this.setState({ username: random(animals) });
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
            <Jumbotron style={{ backgroundColor: 'CadetBlue' }}>
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
                    autoComplete="off"
                    type="text"
                    name="username"
                    value={username}
                    placeholder="Generate or Create a Username"
                    onChange={this.updateUsername}
                  />
                  <InputGroup.Append>
                    <Button type="button" onClick={this.generateName} variant="info">Generate Random</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Button variant="success" type="submit" onSubmit={this.redirect}>Start Chatting</Button>
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
