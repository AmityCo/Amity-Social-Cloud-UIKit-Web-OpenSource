import React from 'react';
import styled from 'styled-components';

import { Remove } from '~/icons';

import Button from '~/core/components/Button';

export const Chip = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  background: ${({ theme }) => theme.palette.base.shade4};
  border-radius: 28px;
  margin: 0.25rem;
  cursor: pointer;
`;

export const Name = styled.span`
  margin: 0 0.5rem;
`;

export const Close = styled(Remove).attrs({ width: 12, height: 12 })`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const RoundButton = styled(Button)`
  padding: 0.4rem 0.55rem;
  border-radius: 10rem;
`;
