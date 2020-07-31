import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faImage } from '@fortawesome/pro-regular-svg-icons';
import { PrimaryButton } from '../commonComponents/Button';
import UIAvatar from '../Avatar';

export const ImagePostIcon = styled(FaIcon).attrs({ icon: faImage })`
  font-size: 18px;
  cursor: pointer;
  margin-right: 20px;
  color: #17181c;
`;

export const FilePostIcon = styled(FaIcon).attrs({ icon: faPaperclip })`
  font-size: 18px;
  margin-right: 12px;
  cursor: pointer;
  color: #17181c;
`;

export const PostComposeContainer = styled.div`
  width: 560px;
  padding: 16px 20px 12px 16px;
  background: #ffffff;
  border: 1px solid #edeef2;
  border-radius: 4px;
`;

export const PostComposeTextarea = styled(TextareaAutosize).attrs({ rows: 1, maxRows: 15 })`
  padding: 0;
  outline: none;
  border: none;
  border-radius: 4px;
  resize: none;
`;

export const PostComposeTextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  flex-grow: 1;
  border-radius: 4px;
  border: 1px solid #e3e4e8;
`;

export const ActionsBar = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
`;
export const PostContainer = styled.div`
  display: flex;
`;

export const PostButton = styled(PrimaryButton)`
  padding: 10px 16px;
  margin-left: auto;
`;

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;
