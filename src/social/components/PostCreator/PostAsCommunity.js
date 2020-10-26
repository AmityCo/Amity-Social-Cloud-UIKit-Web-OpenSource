import React from 'react';
import { PostAsCommunityContainer, Checkbox, Caption } from './styles';

const PostAsCommunity = ({ value, onChange }) => (
  <PostAsCommunityContainer>
    <Checkbox checked={value} onChange={e => onChange(e.target.checked)} />
    <div>
      Post as community
      <Caption>Enable this will publish the post on behalf of community account</Caption>
    </div>
  </PostAsCommunityContainer>
);

export default PostAsCommunity;
