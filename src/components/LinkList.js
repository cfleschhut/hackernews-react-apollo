import React, { Component } from 'react';
import Link from './Link';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class LinkList extends Component {
  render() {
    const { feedQuery } = this.props;

    if (feedQuery && feedQuery.loading) {
      return <div>Loading…</div>;
    }

    if (feedQuery && feedQuery.error) {
      return <div>Error</div>;
    }

    const linksToRender = feedQuery.feed.links;

    return (
      <div>
        {linksToRender.map(link => (
          <Link
            key={link.id}
            link={link}
          />
        ))}
      </div>
    );
  }
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        description
        url
      }
    }
  }
`;

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);
