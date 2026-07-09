import React from 'react';
import styled, { css } from 'styled-components';
import { ErrorMessage as FormErrorMessage } from '@hookform/error-message';

import Button, { PrimaryButton } from '~/core/components/Button';
import { CircleRemove } from '~/icons';
import Select from '~/core/components/Select';
import InputText from '~/core/components/InputText';

const shadowFocus = css`
  &:focus,
  &:focus-visible,
  &:focus-within {
    --tw-ring-offset-shadow: 0 0 0 var(--tw-ring-offset-width, 0px) var(--color-background-surface);
    --tw-ring-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width, 0px))
      var(--color-foreground-accent);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
    outline: none;
  }
`;

const ErrorMessageWrapper = styled.div`
  margin-top: 8px;
  color: var(--asc-color-alert-default);
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

  background: color-mix(
    in srgb,
    var(--color-background-surface-subtle) calc(var(--tw-bg-opacity) * 100%),
    transparent
  );
  border: 1px solid
    color-mix(in srgb, var(--color-edge) calc(var(--tw-border-opacity) * 100%), transparent) !important;

  textarea {
    ${shadowFocus}
  }
`;

export const TextInput = styled.input`
  ${({ theme }) => theme.typography.global};
  border-radius: 4px;
  border: 1px solid
    color-mix(in srgb, var(--color-edge) calc(var(--tw-border-opacity) * 100%), transparent) !important;
  padding: 10px 12px;
  outline: none;

  ${shadowFocus}
`;

export const OptionInput = styled(TextInput)`
  background: color-mix(
    in srgb,
    var(--color-background-surface-subtle) calc(var(--tw-bg-opacity) * 100%),
    transparent
  );
  width: 100%;
  padding-right: 60px;
  color: color-mix(
    in srgb,
    var(--color-foreground-primary) calc(var(--tw-text-opacity) * 100%),
    transparent
  );
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

export const Field = styled.div<{ horizontal?: boolean; separate?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ horizontal }) => horizontal && `flex-direction: row`};
  ${({ separate }) =>
    separate &&
    `
    border-top: 1px solid var(--asc-color-base-shade4);
    padding-top: 20px;
  `};
  margin-bottom: 20px;
`;

export const FormBody = styled.div``;

export const ErrorMessage = (props: Omit<React.ComponentProps<typeof FormErrorMessage>, 'as'>) => (
  <FormErrorMessage as={ErrorMessageWrapper} {...props} />
);

export const Footer = styled.div<{ edit?: boolean }>`
  border-top: 1px solid var(--asc-color-base-shade4);
  padding: ${({ edit }) => (edit ? `12px 0` : `12px 16px`)};
  display: flex;
  justify-content: ${({ edit }) => (edit ? 'flex-start' : 'flex-end')};
`;

export const Label = styled.label`
  ${({ theme }) => theme.typography.bodyBold};
    &.required {
      &::after {
        color: var(--asc-color-alert-default);
        content: ' *';
      }
    }
  }
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

export const SubmitButton = styled(PrimaryButton).attrs<{ edit?: boolean }>({
  type: 'submit',
})`
  font-weight: normal;
  background-color: color-mix(
    in srgb,
    var(--color-action-primary) calc(var(--tw-bg-opacity) * 100%),
    transparent
  );
  border: 1px solid
    color-mix(
      in srgb,
      var(--color-action-primary-border) calc(var(--tw-border-opacity) * 100%),
      transparent
    );
  outline: none;
  cursor: pointer;
  border-radius: 0.25rem;
  text-transform: uppercase;
  padding: 10px 16px;
  margin-left: 12px;
  color: color-mix(
    in srgb,
    var(--color-action-primary-text) calc(var(--tw-text-opacity) * 100%),
    transparent
  );

  &:hover:not(:disabled) {
    color: var(--asc-color-primary-shade1);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--color-action-primary-text-disabled);
    background-color: var(--color-action-primary-disabled);
  }
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
    border-radius: 4px;
    padding: 10px 12px;
    background: color-mix(
      in srgb,
      var(--color-background-surface-subtle) calc(var(--tw-bg-opacity) * 100%),
      transparent
    );
    border: 1px solid
      color-mix(in srgb, var(--color-edge) calc(var(--tw-border-opacity) * 100%), transparent) !important;
    color: color-mix(
      in srgb,
      var(--color-foreground-primary) calc(var(--tw-text-opacity) * 100%),
      transparent
    );
    ${shadowFocus}
  }

  /*
   * Dropdown popup. It renders inline inside the Select (not portaled), so these
   * descendant rules reach it. The Menu is the visible panel (parent of the menu
   * items); its opaque DS surface fill covers the Frame's frozen-light background
   * behind it. Items keyed on their stable data-testid suffix so the empty
   * anchor (no data-testid passed) still matches.
   */
  div:has(> [data-testid$='select-menu-item']) {
    background: color-mix(
      in srgb,
      var(--color-background-surface) calc(var(--tw-bg-opacity) * 100%),
      transparent
    );
    border: 0;
  }

  /*
   * The Frame panel (parent of the Menu) ships the kit's frozen white background,
   * which peeks around the Menu as a white ring. Clear it so only the Menu's DS
   * surface shows; the Frame's drop-shadow is unaffected.
   */
  div:has(> div > [data-testid$='select-menu-item']) {
    background: transparent !important;
  }

  [data-testid$='select-menu-item'] {
    color: color-mix(
      in srgb,
      var(--color-foreground-primary) calc(var(--tw-text-opacity) * 100%),
      transparent
    );
  }

  [data-testid$='select-menu-item']:hover {
    background: color-mix(
      in srgb,
      var(--color-background-surface-subtle) calc(var(--tw-bg-opacity) * 100%),
      transparent
    ) !important;
  }
`;

export const Counter = styled.div`
  margin-left: auto;
  color: var(--asc-color-base-shade1);
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
