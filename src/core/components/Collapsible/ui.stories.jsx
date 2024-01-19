import React from 'react';
import { useArgs } from '@storybook/client-api';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import UiKitCollapsible, { VISIBLE_AMOUNT } from '.';

export default {
  title: 'Ui Only/Collapsible',
};

const Item = styled.div`
  padding: 5px;
  width: 200px;
  color: ${({ theme }) => theme.palette.base.shade1};
  border: 1px solid ${({ theme }) => theme.palette.highlight.shade1};
`;

export const SimpleCollapsible = {
  render: function Render() {
    const [{ visibleAmount, onExpand, itemsAmount }] = useArgs();
    return (
      <UiKitCollapsible visibleAmount={Number(visibleAmount)} onExpand={onExpand}>
        {Array.from({ length: itemsAmount }).map((_, index) => (
          <Item key={index}>{index}</Item>
        ))}
      </UiKitCollapsible>
    );
  },

  args: {
    visibleAmount: VISIBLE_AMOUNT,
    itemsAmount: VISIBLE_AMOUNT,
  },

  argTypes: {
    visibleAmount: { control: { type: 'number', step: 1, min: 0 } },
    itemsAmount: { control: { type: 'number', step: 1, min: 0 } },
    onExpand: { action: 'onExpand()' },
  },
};

const ButtonLink = styled.button.attrs({ role: 'button' })`
  color: ${({ theme }) => theme.palette.highlight.main};
  font-size: 14px;
  border: none;
  outline: none;
  background: none;
  padding: 4px 0 4px 0px;
  text-align: left;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.palette.highlight.main};
  }
`;

export const CollapsibleWithCustomTrigger = {
  render: function Render() {
    const [{ visibleAmount, onExpand, itemsAmount }] = useArgs();
    return (
      <UiKitCollapsible
        visibleAmount={Number(visibleAmount)}
        renderTrigger={(handleExpand) => (
          <ButtonLink onClick={handleExpand}>
            <FormattedMessage id="collapsible.viewAll" />
          </ButtonLink>
        )}
        onExpand={onExpand}
      >
        {Array.from({ length: itemsAmount }).map((_, index) => (
          <Item key={index}>{index}</Item>
        ))}
      </UiKitCollapsible>
    );
  },

  args: {
    visibleAmount: VISIBLE_AMOUNT,
    itemsAmount: VISIBLE_AMOUNT,
  },

  argTypes: {
    visibleAmount: { control: { type: 'number', step: 1, min: 0 } },
    itemsAmount: { control: { type: 'number', step: 1, min: 0 } },
    onExpand: { action: 'onExpand()' },
  },
};
