import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import EmptyState from '~/core/components/EmptyState';
import UnknownPost from '~/icons/UnknownPost';
import { PostContainer } from '~/social/components/post/Post/styles';

interface Props {
  children?: ReactNode;
}

interface State {
  error?: Error | null;
}

export default class PostErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown) {
    if (error instanceof Error) {
      console.error(error);

      return { error };
    }
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
