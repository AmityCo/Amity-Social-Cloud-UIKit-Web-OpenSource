import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faShare, faMinusCircle } from '@fortawesome/pro-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/pro-solid-svg-icons';

import TextareaAutosize from 'react-autosize-textarea';
import UIOptionMenu from '~/core/components/OptionMenu';
import Time from '~/core/components/Time';
import UICommentComposeBar from '~/social/components/CommentComposeBar';
import { SecondaryButton } from '~/core/components/Button';

import UIAvatar from '~/core/components/Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const OptionMenu = styled(UIOptionMenu)`
  color: ${({ theme }) => theme.palette.neutral.main};
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

export const Content = styled.div`
  width: 100%;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

export const CommentContent = styled.div`
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const CommentInfo = styled.div`
  margin-left: 8px;
`;

export const AuthorName = styled.div`
  ${({ theme }) => theme.typography.body}
`;

export const CommentDate = styled(Time)`
  margin-left: 5px;
  color: ${({ theme }) => theme.palette.base.shade1};
  &::before {
    content: '• ';
  }
  ${({ theme }) => theme.typography.caption}
`;

export const EditedMark = styled.div`
  margin-left: 5px;
  color: ${({ theme }) => theme.palette.neutral.shade1};
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

export const DeletedCommentContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.shade3};
  padding: 16px 0;
`;

export const DeletedIcon = styled(FaIcon).attrs({ icon: faMinusCircle })`
  font-size: 18px;
`;

export const IconContainer = styled.div`
  padding-right: 10px;
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Text = styled.span`
  font-size: 14px;
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

export const CommentEditContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;

  > * {
    margin-left: 8px;
  }
`;

export const CommentEditTextarea = styled(TextareaAutosize).attrs({ rows: 1, maxRows: 15 })`
  padding: 10px 12px 21px 10px;
  outline: none;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
  resize: none;
  ${({ theme }) => theme.typography.global}
`;
