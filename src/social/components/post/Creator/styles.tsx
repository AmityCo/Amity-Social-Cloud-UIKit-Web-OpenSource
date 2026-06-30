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
  margin-bottom: 12px;
`;

export const Footer = styled.div`
  padding-top: 12px;
  display: flex;
  align-items: center;

  & > :not(:last-child) {
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
  /*
   * Match v4 CommentComposer's foreground/background so the v3 post composer
   * tracks our DS tokens in both light and dark themes instead of the kit's
   * styled-components palette (which is frozen at light). Drop the wrapper
   * border (the v4 comment input has no border either) and match the post
   * card's corner radius.
   *
   * NOTE: do NOT add overflow:hidden here. react-mentions renders the
   * mention-autocomplete list as an absolutely-positioned child of this
   * container, so clipping the overflow cuts the suggestions down to a thin
   * sliver inside the input field (ENG-701).
   */
  background: var(--asc-color-base-shade4) !important;
  border: none !important;
  border-radius: var(--asc-border-radius-md) !important;

  textarea {
    width: 100%;
    color: var(--asc-color-base-default) !important;
  }
`;

export const VideoAttachmentIcon = styled(PlayCircle)`
  vertical-align: -0.125em;
`;

export const PollButton = styled.button`
  background: none;
  border: none;
  padding: 0;
`;

export const PollIcon = styled(Poll)``;
