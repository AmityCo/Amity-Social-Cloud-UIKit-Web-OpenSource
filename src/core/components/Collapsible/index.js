import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '~/core/components/Button';

export const VISIBLE_AMOUNT = 5;

const defaultTrigger = (handleExpand) => {
  return (
    <Button onClick={handleExpand}>
      <FormattedMessage id="collapsible.viewAll" />
    </Button>
  );
};

const Collapsible = ({
  onExpand = () => {},
  visibleAmount = VISIBLE_AMOUNT,
  renderTrigger = defaultTrigger,
  children,
}) => {
  const visibleChildren =
    visibleAmount < children.length ? children.slice(0, visibleAmount) : children;

  const [expanded, setExpanded] = useState(visibleAmount >= children.length);

  const handleExpand = () => {
    setExpanded(true);
    onExpand();
  };

  if (expanded) {
    return children;
  }

  return (
    <>
      {visibleChildren}
      {renderTrigger(handleExpand)}
    </>
  );
};

Collapsible.propTypes = {
  renderTrigger: PropTypes.func,
  visibleAmount: PropTypes.number,
  children: PropTypes.node,
  onExpand: PropTypes.func,
};

export default Collapsible;
