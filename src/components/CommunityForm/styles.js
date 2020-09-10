import React from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage as FormErrorMessage } from '@hookform/error-message';
import {
  faGlobeAfrica,
  faLockAlt,
  faCamera,
  faChevronDown,
  faTimes,
} from '@fortawesome/pro-regular-svg-icons';
import { PrimaryButton } from 'components/Button';
import Popover from 'components/Popover';
import UIAvatar from 'components/Avatar';
import Menu from 'components/Menu';

const ErrorMessageWrapper = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.palette.alert.main};
  ${({ theme }) => theme.typography.caption}
`;

export const ErrorMessage = props => <FormErrorMessage as={ErrorMessageWrapper} {...props} />;

export const WorldIcon = styled(FaIcon).attrs({ icon: faGlobeAfrica })`
  font-size: 20px;
`;

export const LockIcon = styled(FaIcon).attrs({ icon: faLockAlt })`
  font-size: 20px;
`;

export const CloseIcon = styled(FaIcon).attrs({ icon: faTimes })`
  font-size: 12px;
  padding: 5px 12px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const CameraIcon = styled(FaIcon).attrs({ icon: faCamera })`
  font-size: 20px;
  color: #fff;
  position: absolute;
  top: 20px;
  left: 22px;
`;

export const Selector = styled.div`
  border: 1px solid #e3e4e8;
  &:focus-within {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
  border-radius: 4px;
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  max-height: 200px;
  overflow-y: auto;
`;

export const Chip = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 28px;
  margin-right: 4px;
  margin-bottom: 4px;
`;

export const UserSelectorInput = styled.input`
  outline: none;
  border: none;
`;

export const SelectorPopover = styled(Popover).attrs({
  disableReposition: true,
  position: 'bottom',
})`
  width: 488px;
`;

export const SelectorList = styled(Menu)`
  max-height: 184px;
  overflow: scroll;
`;

export const AvatarWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const IconWrapper = styled.div`
  margin-right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: ${({ theme }) => theme.palette.base.shade4};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Counter = styled.div`
  margin-left: auto;
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.caption}
`;

export const Label = styled.label`
  ${({ theme }) => theme.typography.bodyBold}
  margin-bottom: 4px;
  ${({ required }) =>
    required &&
    `
  &:after {
    color: ${({ theme }) => theme.palette.alert.main};
    content: ' *';
  }
`}
`;

export const LabelCounterWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Radio = styled.input`
  width: 20px;
  height: 20px;
  margin-left: auto;
  margin-right: 0;
  flex-shrink: 0;
`;

export const Form = styled.form`
  width: 520px;
`;

export const SubmitButton = styled(PrimaryButton).attrs({
  type: 'submit',
})`
  padding: 10px 16px;
  margin-left: 12px;
`;

export const FormBlockHeader = styled.div`
  padding: 12px 16px;
  ${({ theme }) => theme.typography.title}
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.base.shade4};
`;

export const FormBlockContainer = styled.div`
  background: #fff;
  ${({ theme, edit }) =>
    edit
      ? `
  margin-top: 12px;
  border: 1px solid #EDEEF2;
  border-radius: 4px;
`
      : ` 
  :not(:last-child) {
    border-bottom: 1px solid${theme.palette.base.shade4};
  }
`}
`;

export const FormBlockBody = styled.div`
  ${({ edit }) => (edit ? `padding: 0 16px 20px;` : `padding: 20px 16px 16px;`)}
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PermissionControlContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: 16px;
  }
  ${({ theme }) => theme.typography.bodyBold}
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.body}
`;

export const InformationBlock = styled.div`
  padding 0 16px 20px;
  display: flex;
  flex-direction: column;
`;

export const CommunityPermissionBlock = styled.div`
  padding 0 16px 20px;
  display: flex;
  flex-direction: column;
`;

export const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
`;

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const AvatarUploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AboutTextarea = styled(TextareaAutosize).attrs({ rows: 3, maxRows: 15 })`
  display: block;
  outline: none;
  border-radius: 4px;
  resize: none;
  border: 1px solid #e3e4e8;
  padding: 10px 12px;
  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const TextField = styled.input`
  border-radius: 4px;
  border: 1px solid #e3e4e8;
  padding: 10px 12px;
  outline: none;
  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const SelectIcon = styled(FaIcon).attrs({ icon: faChevronDown })`
  font-size: 16px;
  margin-left: auto;
`;

export const Field = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  ${({ error }) =>
    error &&
    `
${AboutTextarea}, ${TextField} {
    border-color: ${({ theme }) => theme.palette.alert.main};
}

  `}
`;

export const MembersField = styled(Field)`
  margin-top: 0;
`;

export const FormBody = styled.div``;
