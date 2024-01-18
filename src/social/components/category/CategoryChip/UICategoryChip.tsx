import React, { useCallback } from 'react';

import Avatar from '~/core/components/Avatar';
import { Close, Remove } from '~/icons';
import { backgroundImage as CategoryImage } from '~/icons/Category';

import { Chip, Name, RoundButton } from './styles';

interface UICategoryChipProps {
  categoryId?: string;
  name?: string;
  fileUrl?: string;
  onClick?: (categoryId: string) => void;
  onRemove?: (categoryId: string) => void;
}

const UICategoryChip = ({ categoryId, name, fileUrl, onClick, onRemove }: UICategoryChipProps) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (categoryId) {
        onClick?.(categoryId);
      }
    },
    [onClick, categoryId],
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      if (categoryId) {
        onRemove?.(categoryId);
      }
    },
    [onRemove, categoryId],
  );

  return (
    <Chip onClick={handleClick}>
      <Avatar size="tiny" avatar={fileUrl} backgroundImage={CategoryImage} />
      <Name>{name}</Name>

      {!!onRemove && (
        <RoundButton onClick={handleRemove}>
          <Close />
        </RoundButton>
      )}
    </Chip>
  );
};

export default UICategoryChip;
