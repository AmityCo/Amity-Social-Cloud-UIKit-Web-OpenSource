import React from 'react';
import { FormattedMessage } from 'react-intl';
import EmptyState from '~/core/components/EmptyState';
import UnknownPost from '~/icons/UnknownPost';
import { PostContainer } from '~/social/components/post/Post/styles';

export default class PostErrorBoundary extends React.PureComponent {
  static getDerivedStateFromError(error) {
    console.error(error);

    return { error };
  }

  constructor(props) {
    super(props);

    this.state = { error: undefined };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <PostContainer>
          <EmptyState
            title={<FormattedMessage id="post.renderingError.title" />}
            icon={<UnknownPost />}
          >
            <FormattedMessage id="post.renderingError.description" />
          </EmptyState>
        </PostContainer>
      );
    }

    return children;
  }
}
