import styled, { css } from 'styled-components';

import { ErrorMessage as FormErrorMessage } from '@hookform/error-message';
import React from 'react';
import Select from '~/core/components/Select';
import { PrimaryButton } from '~/core/components/Button';

export const ChannelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const FormBlockBody = styled.div`
  padding: 20px 16px 16px;
`;

export const FormBlockContainer = styled.div``;

export const StyledSelect = styled(Select)`
  button {
    width: 100%;
  }
`;

export const TextInput = styled.input`
  ${({ theme }) => theme.typography.global};
  border-radius: 4px;
  border: 1px solid #e3e4e8;
  padding: 10px 12px;
  outline: none;
  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const Label = styled.label`
  ${({ theme }) => theme.typography.bodyBold};
  ${({ theme }) => `
    &.required {
      &::after {
        color: ${theme.palette.alert.main};
        content: ' *';
      }
    }
  `}
`;

export const LabelContainer = styled.div`
  width: 700px;
  margin-right: 20px;
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const EditChatMemberComposerContainer = styled.div``;

export const Field = styled.div<{ horizontal?: string; separate?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ horizontal }) => horizontal && `flex-direction: row`};
  ${({ separate, theme }) =>
    separate &&
    `
    border-top: 1px solid ${theme.palette.base.shade4};
    padding-top: 20px;
  `};
  margin-bottom: 20px;
`;

const ErrorMessageWrapper = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.palette.alert.main};
  ${({ theme }) => theme.typography.caption}
`;

export const ErrorMessage = (props: React.ComponentProps<typeof FormErrorMessage>) => (
  <FormErrorMessage as={ErrorMessageWrapper} {...props} />
);

export const Footer = styled.div<{ edit?: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  padding: ${({ edit }) => (edit ? `12px 0` : `12px 16px`)};
  display: flex;
  justify-content: ${({ edit }) => (edit ? 'flex-start' : 'flex-end')};
`;

export const FormBody = styled.div``;

export const Form = styled.form``;

export const ControllerContainer = styled.div`
  width: 100%;
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
