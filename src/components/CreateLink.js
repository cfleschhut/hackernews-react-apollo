import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateLink extends Component {
  constructor() {
    super();

    this.state = {
      description: '',
      url: ''
    };
  }

  _createLink = async () => {
    const { description, url } = this.state;

    await this.props.postMutation({
      variables: {
        description,
        url
      }
    });

    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input type="text"
            className="mb2"
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            placeholder="A description for the link"
          />
          <input type="text"
            className="mb2"
            value={this.state.url}
            onChange={(e) => this.setState({ url: e.target.value })}
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createLink()}>
          Submit
        </button>
      </div>
    );
  }
}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(
      description: $description,
      url: $url
    ) {
      id
      createdAt
      url
      description
    }
  }
`;

export default graphql(
  POST_MUTATION, { name: 'postMutation' }
)(CreateLink);
