import React, { useCallback } from 'react';
import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';

import Avatar from '~/core/components/Avatar';
import { Remove } from '~/icons';
import { backgroundImage as UserImage } from '~/icons/User';

import Button from '~/core/components/Button';

const Chip = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  background: ${({ theme }) => theme.palette.base.shade4};
  border-radius: 28px;
  margin: 0.25rem;
  cursor: pointer;
`;

const Name = styled.span`
  margin: 0 0.5rem;
`;

const Close = styled(Remove)`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;

const RoundButton = styled(Button)`
  padding: 0.4rem 0.55rem;
  border-radius: 10rem;
`;

const UserChip = ({ userId, displayName = 'Anonymous', fileUrl, onClick = () => {}, onRemove }) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onClick(userId);
    },
    [onClick, userId],
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      onRemove(userId);
    },
    [onRemove, userId],
  );

  return (
    <Chip onClick={handleClick}>
      <Avatar size="tiny" avatar={fileUrl} backgroundImage={UserImage} />
      <Name>{displayName}</Name>

      <ConditionalRender condition={!!onRemove}>
        <RoundButton onClick={handleRemove}>
          <Close />
        </RoundButton>
      </ConditionalRender>
    </Chip>
  );
};

export default customizableComponent('UserChip', UserChip);
