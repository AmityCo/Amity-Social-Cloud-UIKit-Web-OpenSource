import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { ErrorMessage as FormErrorMessage } from '@hookform/error-message';
import { PrimaryButton } from '~/core/components/Button';
import ImageUploader from '~/core/components/Uploaders/Image';
import UIAvatar from '~/core/components/Avatar';
import { ChevronDown, Close, Globe, Lock } from '~/icons';

const ErrorMessageWrapper = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.palette.alert.main};
  ${({ theme }) => theme.typography.caption}
`;

export const ErrorMessage = (props: React.ComponentProps<typeof FormErrorMessage>) => (
  <FormErrorMessage as={ErrorMessageWrapper} {...props} />
);

export const InputPlaceholder = styled.span`
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const WorldIcon = styled(Globe)<{ icon?: ReactNode }>`
  font-size: 20px;
`;

export const LockIcon = styled(Lock)<{ icon?: ReactNode }>`
  font-size: 20px;
`;

export const CloseIcon = styled(Close)<{ icon?: ReactNode }>`
  font-size: 12px;
  padding: 5px 12px;
  color: ${({ theme }) => theme.palette.base.shade1};
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
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  max-height: 200px;
  overflow-y: auto;
`;

export const IconWrapper = styled.div`
  margin-right: 1rem;
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
  ${({ theme }) => theme.typography.bodyBold};
  margin-bottom: 4px;
  ${({ theme }) => css`
    &.required {
      &::after {
        color: ${theme.palette.alert.main};
        content: ' *';
      }
    }
  `}
`;

export const LabelCounterWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 20px;
  height: 20px;
  margin-left: auto;
  margin-right: 0;
  flex-shrink: 0;
`;

export const Form = styled.form`
  min-width: 520px;
`;

export const SubmitButton = styled(PrimaryButton).attrs<{ edit?: boolean }>({
  type: 'submit',
})`
  padding: 10px 16px;
  margin-left: 12px;
  ${({ edit }) =>
    edit &&
    css`
      min-width: 100px;
      margin-left: 0;
    `};
`;

export const FormBlockHeader = styled.div`
  padding: 12px 16px;
  ${({ theme }) => theme.typography.title};
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.base.shade4};
`;

export const FormBlockContainer = styled.div<{ edit?: boolean }>`
  background: ${({ theme }) => theme.palette.system.background};
  ${({ theme, edit }) =>
    edit
      ? css`
          > :not(:first-child) {
            margin-top: 12px;
          }
          border: 1px solid #edeef2;
          border-radius: 4px;
        `
      : css`
          > :not(:last-child) {
            border-bottom: 1px solid ${theme.palette.base.shade4};
          }
        `}
`;

export const FormBlockBody = styled.div<{ edit?: boolean }>`
  ${({ edit }) =>
    edit
      ? css`
          padding: 0 16px 20px;
        `
      : css`
          padding: 20px 16px 16px;
        `}
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PermissionControlContainer = styled.div`
  display: flex;
  align-items: center;
  > :not(:last-child) {
    margin-bottom: 16px;
  }
  ${({ theme }) => theme.typography.bodyBold}
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.body};
  width: 357px;
`;

export const InformationBlock = styled.div`
  padding: 0 16px 20px;
  display: flex;
  flex-direction: column;
`;

export const CommunityPermissionBlock = styled.div`
  padding: 0 16px 20px;
  display: flex;
  flex-direction: column;
`;

export const Footer = styled.div<{ edit?: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  padding: ${({ edit }) => (edit ? `12px 0` : `12px 16px`)};
  display: flex;
  justify-content: ${({ edit }) => (edit ? 'flex-start' : 'flex-end')};
`;

export const UploadOverlay = styled.div`
  background: rgba(0, 0, 0, 0);
  top: 0;
  left: 0;
  z-index: 1;
  transition: background 0.3s;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: none;
`;

export const AvatarImageUploader = styled(ImageUploader)`
  display: inline-block;
  width: 100%;
  height: 100%;
`;

export const AvatarUploadContainer = styled.div`
  background: ${({ theme }) => theme.palette.base.shade3};
  position: relative;
  display: block;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  align-self: center;
  &:hover ${UploadOverlay} {
    background: rgba(0, 0, 0, 0.5);
  }
`;

export const AvatarWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const AboutTextarea = styled(TextareaAutosize).attrs({ minRows: 3, maxRows: 15 })`
  ${({ theme }) => theme.typography.global};
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
  ${({ theme }) => theme.typography.global};
  border-radius: 4px;
  border: 1px solid #e3e4e8;
  padding: 10px 12px;
  outline: none;
  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const SelectIcon = styled(ChevronDown)`
  font-size: 16px;
  margin-left: auto;
`;

export const Field = styled.div<{ error?: ReactNode }>`
  > :not(:first-child) {
    margin-top: 20px;
  }
  display: flex;
  flex-direction: column;

  ${({ error }) =>
    error &&
    css`
      ${AboutTextarea}, ${TextField} {
        border-color: ${({ theme }) => theme.palette.alert.main};
      }
    `}
`;

export const MembersField = styled(Field)`
  margin-top: 0;
`;

export const FormBody = styled.div``;

export const CategorySelectorInput = styled.input`
  outline: none;
  border: none;
`;
