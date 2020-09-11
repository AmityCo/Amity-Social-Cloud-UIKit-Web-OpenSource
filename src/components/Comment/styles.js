import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faShare } from '@fortawesome/pro-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/pro-solid-svg-icons';

import { SecondaryButton } from 'components/Button';
import Time from 'components/Time';
import UIOptions from 'components/Options';
import UICommentComposeBar from 'components/CommentComposeBar';

import UIAvatar from 'components/Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const Options = styled(UIOptions).attrs({ align: 'start' })`
  color: #898e9e;
  &:hover {
    background-color: transparent;
  }
`;

export const CommentBlock = styled.div`
  border-top: 1px solid #e3e4e8;
`;

const encodeHexColor = hex => hex.replace('#', '%23');

// svg embeded in order to make theamed stroke color
export const CommentContainer = styled.div`
  display: flex;
  color: black;
  padding-top: 16px;
  :not(:last-child) {
    background-position: 0 20px;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0 L20 9000" stroke="${({ theme }) =>
        encodeHexColor(theme.palette.base.shade4)}"/>
    </svg>');
}
`;

export const ReplyContainer = styled.div`
  display: flex;
  color: black;
  padding-top: 16px;
  &:last-child {
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="40">
      <path d="M20 0 L 20 40" stroke="${({ theme }) => encodeHexColor(theme.palette.base.shade4)}"/>
    </svg>');
  }
  :not(:last-child) {
    background-repeat: repeat-y;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="40">
      <path d="M20 0 L 20 40" stroke="${({ theme }) => encodeHexColor(theme.palette.base.shade4)}"/>
    </svg>');
}
`;

export const CommentComposeBar = styled(UICommentComposeBar)`
  border: none;
  padding: 8px 0 16px;
  background-repeat: no-repeat;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="40">
    <path d="M20 0 L 20 40" stroke="${({ theme }) => encodeHexColor(theme.palette.base.shade4)}"/>
  </svg>');
`;

export const Content = styled.div``;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

export const CommentContent = styled.div`
  overflow-wrap: break-word;
  color: #17181c;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const CommentInfo = styled.div`
  margin-left: 8px;
`;

export const AuthorName = styled.div`
  ${({ theme }) => theme.typography.title}
`;

export const CommentDate = styled(Time)`
  margin-left: 5px;
  color: ${({ theme }) => theme.color.neutral1};
  &::before {
    content: '• ';
  }
  ${({ theme }) => theme.typography.caption}
`;

export const ReadMoreButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 4px;
`;

export const InteractionBar = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 0;
  margin-left: -10px;
`;

export const LikeIcon = styled(FaIcon).attrs({ icon: faThumbsUp })`
  font-size: 16px;
  margin-right: 5px;
`;

export const LikeButton = styled(SecondaryButton)`
  margin-left: -10px;

  &:hover {
    background-color: transparent;
  }
`;

export const ReplyIcon = styled(FaIcon).attrs({ icon: faShare })`
  font-size: 16px;
  margin-right: 5px;
`;

export const ReplyButton = styled(SecondaryButton)`
  margin-left: -10px;

  &:hover {
    background-color: transparent;
  }
`;

export const SolidLikeIcon = styled(FaIcon).attrs({ icon: faThumbsUpSolid })`
  font-size: 16px;
  margin-right: 5px;
`;
