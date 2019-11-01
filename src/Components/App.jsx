import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import socketIOClient from 'socket.io-client';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:3000',
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('FromAPI', (data) => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    return (
      <>
        <h1>Hello from React</h1>
        <Form>
          <Form.Group controlId="TextBox">
            <Form.Control type="text" />
          </Form.Group>
        </Form>
        {
          response && (
          <div>
            <div>
              San Francisco Current Temperature
            </div>
            <div>
              { response }
            </div>
          </div>
          )
        }
      </>
    );
  }
}
