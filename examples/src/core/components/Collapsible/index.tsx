import React, { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '~/core/components/Button';

export const VISIBLE_AMOUNT = 5;

const defaultTrigger = (handleExpand?: React.MouseEventHandler<HTMLButtonElement>) => {
  return (
    <Button onClick={handleExpand}>
      <FormattedMessage id="collapsible.viewAll" />
    </Button>
  );
};

interface CollapsibleProps<T> {
  items: T[];
  onExpand?: () => void;
  visibleAmount?: number;
  renderTrigger?: (handleExpand: () => void) => ReactNode;
  renderItem: (item: T) => ReactNode;
}

const Collapsible = <T,>({
  items = [],
  onExpand = () => {},
  visibleAmount = VISIBLE_AMOUNT,
  renderTrigger = defaultTrigger,
  renderItem,
}: CollapsibleProps<T>) => {
  const visibleItems = visibleAmount < items.length ? items.slice(0, visibleAmount) : items;

  const [expanded, setExpanded] = useState(visibleAmount >= items.length);

  const handleExpand = () => {
    setExpanded(true);
    onExpand();
  };

  if (expanded) {
    return <>{items.map((item) => renderItem(item))}</>;
  }

  return (
    <>
      {visibleItems.map((item) => renderItem(item))}
      {renderTrigger(handleExpand)}
    </>
  );
};

export default Collapsible;
