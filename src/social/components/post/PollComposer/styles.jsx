import React from 'react';
import styled, { css } from 'styled-components';
import { ErrorMessage as FormErrorMessage } from '@hookform/error-message';

import Button, { PrimaryButton } from '~/core/components/Button';
import { CircleRemove } from '~/icons';
import Select from '~/core/components/Select';
import InputText from '~/core/components/InputText';

const ErrorMessageWrapper = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.palette.alert.main};
  ${({ theme }) => theme.typography.caption}
`;

export const PollComposerContainer = styled.div``;

export const Form = styled.form``;

export const OptionsComposerContainer = styled.div``;

export const OptionItemContainer = styled.div`
  margin-bottom: 12px;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const MentionTextInput = styled(InputText)`
  ${({ theme }) => theme.typography.global};
  outline: none;
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

export const OptionInput = styled(TextInput)`
  background: ${({ theme }) => theme.palette.base.shade4};
  width: 100%;
  padding-right: 60px;
`;

export const CloseIcon = styled(CircleRemove)``;

export const CloseButton = styled(Button)`
  background: transparent;
  border: none;
  outline: none;
`;

export const FormBlockBody = styled.div`
  padding: 20px 16px 16px;
`;

export const FormBlockContainer = styled.div``;

export const Field = styled.div`
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

export const FormBody = styled.div``;

export const ErrorMessage = (props) => <FormErrorMessage as={ErrorMessageWrapper} {...props} />;

export const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  padding: ${({ edit }) => (edit ? `12px 0` : `12px 16px`)};
  display: flex;
  justify-content: ${({ edit }) => (edit ? 'flex-start' : 'flex-end')};
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

export const ControllerContainer = styled.div`
  width: 100%;
`;

export const FieldContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const SubmitButton = styled(PrimaryButton).attrs({
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

export const StyledSelect = styled(Select)`
  button {
    width: 100%;
  }
`;

export const Counter = styled.div`
  margin-left: auto;
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.caption}
`;

export const OptionInputContainer = styled.div`
  position: relative;
  width: 100%;

  ${Counter} {
    position: absolute;
    top: 14px;
    right: 8px;
  }
`;

export const TitleContainer = styled.div`
  margin-bottom: 8px;
`;
