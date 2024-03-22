import React from 'react';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { ButtonContainer, CommentEditContainer, CommentEditTextarea } from './styles';

import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';
import { CancelButton, SaveButton } from '~/social/v4/elements';
import { useTheme } from 'styled-components';

interface CommentEditionProps {
  pageId?: '*';
  queryMentionees?: QueryMentioneesFnType;
  onChange?: (data: any) => void;
  value?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
}

export const CommentEdition = ({
  pageId = '*',
  queryMentionees,
  onChange,
  value,
  onCancel,
  onSubmit,
}: CommentEditionProps) => {
  const componentId = 'edit_comment_component';
  const theme = useTheme();
  const { getConfig, isExcluded } = useCustomization();
  const componentConfig = getConfig(`${pageId}/${componentId}/*`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/*`);

  const componentTheme = componentConfig?.component_theme?.light_theme || theme.v4.colors.primary;

  if (isElementExcluded) return null;

  return (
    <CommentEditContainer
      style={{
        backgroundColor: componentTheme?.primary_color || theme.v4.colors.primary.default,
      }}
    >
      <CommentEditTextarea
        multiline
        mentionAllowed
        value={value}
        queryMentionees={queryMentionees}
        onChange={(data) => onChange?.(data)}
      />
      <ButtonContainer>
        <CancelButton pageId={pageId} componentId={componentId} onClick={onCancel} />
        <SaveButton pageId={pageId} componentId={componentId} onClick={onSubmit} />
      </ButtonContainer>
    </CommentEditContainer>
  );
};
