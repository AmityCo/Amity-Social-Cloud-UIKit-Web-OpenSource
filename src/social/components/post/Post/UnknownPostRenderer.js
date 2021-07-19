import React from 'react';
import { useIntl } from 'react-intl';
import EmptyState from '~/core/components/EmptyState';
import UnknownPost from '~/icons/UnknownPost';
import { PostContainer } from './styles';

const UnknownPostRenderer = () => {
  const { formatMessage } = useIntl();

  return (
    <PostContainer>
      <EmptyState title={formatMessage({ id: 'post.unknownPost.title' })} icon={<UnknownPost />}>
        {formatMessage({ id: 'post.unknownPost.description' })}
      </EmptyState>
    </PostContainer>
  );
};

export default UnknownPostRenderer;
