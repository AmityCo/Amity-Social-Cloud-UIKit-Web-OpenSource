import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faImage } from '@fortawesome/pro-regular-svg-icons';
import { faSortDown } from '@fortawesome/pro-solid-svg-icons';
import { PrimaryButton } from 'components/Button';
import UIAvatar from 'components/Avatar';

// TODO add icon button
export const ImagePostIcon = styled(FaIcon).attrs({ icon: faImage })`
  font-size: 18px;
  cursor: pointer;
  margin-right: 20px;
  color: ${({ theme, disabled }) => (disabled ? theme.palette.base.shade3 : '#17181c')};
`;

export const SelectIcon = styled(FaIcon).attrs({ icon: faSortDown })`
  font-size: 18px;
  margin-right: 8px;
  margin-top: -4px;
`;

export const FilePostIcon = styled(FaIcon).attrs({ icon: faPaperclip })`
  font-size: 18px;
  margin-right: 12px;
  cursor: pointer;
  color: ${({ theme, disabled }) => (disabled ? theme.palette.base.shade3 : '#17181c')};
`;

const postComposeEditStyle = `
  width: 520px;
  padding: 0;
  border: none;
`;

const postComposeStyle = `
  padding: 16px 20px 12px 16px;
  border: 1px solid #edeef2;
`;

export const PostComposeContainer = styled.div`
  ${({ edit }) => (edit ? postComposeEditStyle : postComposeStyle)}
  display: flex;
  background: #ffffff;
  border-radius: 4px;
`;

export const PostComposeTextarea = styled(TextareaAutosize).attrs({ rows: 1, maxRows: 15 })`
  padding: 0;
  outline: none;
  border: none;
  border-radius: 4px;
  resize: none;
`;

const postComposeTextareaWrapperEditStyle = `
  border: none;
  padding: 20px 16px;
`;

const postComposeTextareaWrapperStyle = `
  border: 1px solid #e3e4e8;
  padding: 10px 12px;
  &:focus-within {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
`;

export const PostComposeTextareaWrapper = styled.div`
  ${({ edit }) => (edit ? postComposeTextareaWrapperEditStyle : postComposeTextareaWrapperStyle)}
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 4px;
  min-height: 40px;
`;

const footerEditStyle = `
  border-top: 1px solid${({ theme }) => theme.palette.base.shade4};
  padding: 12px 16px;
`;

const footerStyle = `
  padding-top: 12px;
`;

export const Footer = styled.div`
  ${({ edit }) => (edit ? footerEditStyle : footerStyle)}
`;

export const FooterActionBar = styled.div`
  display: flex;
  align-items: center;
`;

export const PostContainer = styled.div`
  flex-grow: 1;
`;

export const PostButton = styled(PrimaryButton)`
  padding: 10px 16px;
  margin-left: auto;
`;

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const PostAsCommunityContainer = styled.div`
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.base.shade4};
  padding: 10px;
  margin-bottom: 12px;
  ${({ theme }) => theme.typography.captionBold}
`;

export const Checkbox = styled.input.attrs({
  type: 'checkbox',
})`
  margin-right: 10px;
  width: 18px;
  height: 18px;
`;

export const Caption = styled.div`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const AuthorSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const CommunitySeparator = styled.div`
  ${({ theme }) => theme.typography.caption}
  border-top: 1px solid #e3e4e8;
  color: ${({ theme }) => theme.palette.base.shade1};
  padding: 12px;
`;
