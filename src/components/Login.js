import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from '../constants';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      login: true,
      name: '',
      email: '',
      password: ''
    };
  }

  _handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  }

  _toggleLogin = () => {
    this.setState({
      login: !this.state.login
    });
  }

  _confirm = async () => {
    const { login, name, email, password } = this.state;

    if (!login) {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password
        }
      });
      const { token } = result.data.signup;

      this._saveUserData(token);
    }

    if (login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password
        }
      });
      const { token } = result.data.login;

      this._saveUserData(token);
    }

    this.props.history.push('/');
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  }

  render() {
    const { login, name, email, password } = this.state;

    return (
      <div>
        <h4 className='mv3'>
          {login ? 'Login' : 'Sign Up'}
        </h4>

        <div className='flex flex-column'>
          {!login &&
            <input
              type='text'
              name='name'
              value={name}
              onChange={this._handleChange}
              placeholder='Your name'
            />
          }
          <input
            type='text'
            name='email'
            value={email}
            onChange={this._handleChange}
            placeholder='Your email address'
          />
          <input
            type='password'
            name='password'
            value={password}
            onChange={this._handleChange}
            placeholder='Choose a safe password'
          />
        </div>

        <div className='flex mt3'>
          <div
            className='button pointer mr2'
            onClick={this._confirm}
          >
            {login ? 'Login' : 'Create account'}
          </div>
          <div
            className='button pointer'
            onClick={this._toggleLogin}
          >
            {login ? 'Need to create an account?' : 'Already have an account?' }
          </div>
        </div>
      </div>
    );
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(
      email: $email,
      password: $password,
      name: $name
    ) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(
      email: $email,
      password: $password
    ) {
      token
    }
  }
`;

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' })
)(Login);
