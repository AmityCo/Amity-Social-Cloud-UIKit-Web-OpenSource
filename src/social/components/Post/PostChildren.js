import React from 'react';
import styled from 'styled-components';
import PostImage from '~/core/components/Uploaders/Image';
import PostFile from '~/core/components/Uploaders/File';

const ChildPosts = styled.div`
  margin-top: 1rem;
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const PostTypeComponents = {
  file: PostFile,
  image: PostImage,
};

const PostChildren = ({ childrenPosts }) => (
  <ChildPosts>
    {childrenPosts.map(child => {
      const ChildPostComponent = PostTypeComponents[child.dataType];
      if (!ChildPostComponent || !child?.data?.fileId) return null;
      return <ChildPostComponent key={child.data.fileId} fileId={child.data.fileId} fullSize />;
    })}
  </ChildPosts>
);

export default PostChildren;
