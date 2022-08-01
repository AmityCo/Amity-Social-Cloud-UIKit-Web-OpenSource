import styled from 'styled-components';
import { PrimaryButton } from '~/core/components/Button';
import InputText from '~/core/components/InputText';
import UIAvatar from '~/core/components/Avatar';
import { Poll } from '~/icons';
import PlayCircle from '~/icons/PlayCircle';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const PostCreatorContainer = styled.div`
  padding: 16px 20px 12px 16px;
  border: 1px solid #edeef2;
  display: flex;
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px;
`;

export const Footer = styled.div`
  padding-top: 12px;
  display: flex;
  align-items: center;

  & > label {
    margin-right: 0.5rem;
  }
`;

export const PostContainer = styled.div`
  flex-grow: 1;
  width: 85.5%;
`;

export const PostButton = styled(PrimaryButton)`
  padding: 10px 16px;
  margin-left: auto;
`;

export const UploadsContainer = styled.div`
  padding: 0 12px;
`;

export const PostInputText = styled(InputText)`
  display: block;
  & > textarea {
    width: 100%;
  }
`;

export const VideoAttachmentIcon = styled(PlayCircle)`
  vertical-align: -0.125em;
`;

export const PollButton = styled.button`
  background: none;
  border: none;
  background: rgb(235 236 239 / 60%);
  transition: background 0.1s;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus,
  &:active {
    background: rgb(235 236 239);
  }
`;

export const PollIconContainer = styled.div`
  height: 14px;

  &:hover {
    cursor: pointer;
  }
`;

export const PollIcon = styled(Poll)``;
