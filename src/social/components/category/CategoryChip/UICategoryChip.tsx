import React, { useCallback } from 'react';

import Avatar from '~/core/components/Avatar';
import { Close } from '~/icons';
import { backgroundImage as CategoryImage } from '~/icons/Category';

import { Chip, Name, RoundButton } from './styles';
import styled from 'styled-components';

interface UICategoryChipProps {
  categoryId?: string;
  name?: string;
  fileUrl?: string;
  onClick?: (categoryId: string) => void;
  onRemove?: (categoryId: string) => void;
}

const CloseIcon = styled(Close).attrs({ width: 12, height: 12 })`
  fill: ${({ theme }) => theme.palette.neutral.main};
  cursor: pointer;
`;

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
          <CloseIcon />
        </RoundButton>
      )}
    </Chip>
  );
};

export default UICategoryChip;
