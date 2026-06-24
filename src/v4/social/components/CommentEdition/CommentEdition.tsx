import React from 'react';
import { ButtonContainer, CommentEditContainer, CommentEditTextarea } from './styles';
import { QueryMentioneesFnType } from '~/v4/chat/hooks/useMention';
import { SaveButton } from '~/v4/social/elements';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton/EditCancelButton';

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
  const { getConfig, isExcluded } = useCustomization();
  const componentConfig = getConfig(`${pageId}/${componentId}/*`);
  const isElementExcluded = isExcluded(`${pageId}/${componentId}/*`);

  const primaryColor =
    componentConfig?.theme?.light?.primary_color || 'var(--asc-color-primary-default)';

  if (isElementExcluded) return null;

  return (
    <CommentEditContainer style={{ backgroundColor: primaryColor }}>
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
