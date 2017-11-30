import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      login: true,
      email: '',
      password: '',
      name: ''
    };
  }

  _confirm = async () => {
    const { name, email, password } = this.state;
    if (this.state.login) {
      const result = await this.props.authenticateUserMutation({
        variables: {
          email,
          password
        }
      });
      const { id, token } = result.data.authenticateUser;
      this._saveUserData(id, token);
    } else {
      const result = await this.props.signupUserMutation({
        variables: {
          name,
          email,
          password
        }
      });
      const { id, token } = result.data.signupUser;
      this._saveUserData(id, token);
    }
    this.props.history.push('/');
  }

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id);
    localStorage.setItem(GC_AUTH_TOKEN, token);
  }

  render() {
    return (
      <div>
        <h4 className='mv3'>
          {this.state.login ?
            'Login' :
            'Sign Up'
          }
        </h4>
        <div className='flex flex-column'>
          {!this.state.login &&
            <input type='text'
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
              placeholder='Your name'
            />
          }
          <input type='text'
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            placeholder='Your email address'
          />
          <input type='password'
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            placeholder='Choose a safe password'
          />
        </div>
        <div className='flex mt3'>
          <div className='pointer mr2 button'
            onClick={() => this._confirm()}
          >
            {this.state.login ?
              'Login' :
              'Create account'
            }
          </div>
          <div className='pointer button'
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login ?
              'Need to create an account?' :
              'Already have an account?'
            }
          </div>
        </div>
      </div>
    );
  }
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String!) {
    signupUser(
      email: $email,
      password: $password,
      name: $name
    ) {
      id
      token
    }
  }
`;

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(
      email: $email,
      password: $password
    ) {
      id
      token
    }
  }
`;

export default compose(
  graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' }),
  graphql(AUTHENTICATE_USER_MUTATION, { name: 'authenticateUserMutation' })
)(Login);
