import React, { useCallback } from 'react';

import Avatar from '~/core/components/Avatar';
import { Close, Remove } from '~/icons';
import { backgroundImage as UserImage } from '~/icons/User';

import { Chip, Name, RoundButton } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UIUserChipProps {
  userId?: string;
  displayName?: string;
  fileUrl?: string;
  onClick?: (userId: string) => void;
  onRemove?: (userId: string) => void;
}

const UIUserChip = ({
  userId,
  displayName = 'Anonymous',
  fileUrl,
  onClick,
  onRemove,
}: UIUserChipProps) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (userId) {
        onClick?.(userId);
      }
    },
    [onClick, userId],
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      if (userId) {
        onRemove?.(userId);
      }
    },
    [onRemove, userId],
  );

  return (
    <Chip onClick={handleClick}>
      <Avatar size="tiny" avatar={fileUrl} backgroundImage={UserImage} />
      <Name>{displayName}</Name>

      {!!onRemove && (
        <RoundButton onClick={handleRemove}>
          <Close />
        </RoundButton>
      )}
    </Chip>
  );
};

export default (props: UIUserChipProps) => {
  const CustomComponentFn = useCustomComponent<UIUserChipProps>('UserChip');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UIUserChip {...props} />;
};
