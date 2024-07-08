import React from 'react';

import { ButtonContainer, CommentEditContainer, CommentEditTextarea } from './styles';

import { QueryMentioneesFnType } from '~/v4/chat/hooks/useMention';

import { useTheme } from 'styled-components';
import { SaveButton } from '../../elements';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { EditCancelButton } from '../../elements/EditCancelButton/EditCancelButton';

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

  const componentTheme = componentConfig?.theme?.light || theme.v4.colors.primary;

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
        <EditCancelButton pageId={pageId} componentId={componentId} onPress={onCancel} />
        <SaveButton pageId={pageId} componentId={componentId} onPress={onSubmit} />
      </ButtonContainer>
    </CommentEditContainer>
  );
};
