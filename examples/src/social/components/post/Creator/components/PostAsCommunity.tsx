import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const PostAsCommunityContainer = styled.div`
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.base.shade4};
  padding: 10px;
  margin-bottom: 12px;
  ${({ theme }) => theme.typography.captionBold}
`;

const Checkbox = styled.input.attrs({
  type: 'checkbox',
})`
  margin-right: 10px;
  width: 18px;
  height: 18px;
`;

const Caption = styled.div`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.base.shade1};
`;

interface PostAsCommunityProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const PostAsCommunity = ({ value, onChange }: PostAsCommunityProps) => (
  <PostAsCommunityContainer>
    <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
    <div>
      <FormattedMessage id="PostAsCommunity.title" />
      <Caption>
        <FormattedMessage id="PostAsCommunity.caption" />
      </Caption>
    </div>
  </PostAsCommunityContainer>
);

export default PostAsCommunity;
