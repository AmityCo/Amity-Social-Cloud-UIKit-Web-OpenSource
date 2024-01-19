import React from 'react';
import { FormattedMessage } from 'react-intl';

import EmptyState from '~/core/components/EmptyState';
import UnknownPost from '~/icons/UnknownPost';
import { PostContainer } from './styles';

const UnknownPostRenderer = () => {
  return (
    <PostContainer>
      <EmptyState title={<FormattedMessage id="post.unknownPost.title" />} icon={<UnknownPost />}>
        <FormattedMessage id="post.unknownPost.description" />
      </EmptyState>
    </PostContainer>
  );
};

export default UnknownPostRenderer;
