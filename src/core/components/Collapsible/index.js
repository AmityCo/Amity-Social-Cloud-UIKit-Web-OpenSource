import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '~/core/components/Button';
import ConditionalRender from '~/core/components/ConditionalRender';

export const VISIBLE_AMOUNT = 5;

const defaultTrigger = handleExpand => {
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

  return (
    <ConditionalRender condition={expanded}>
      {children}
      <>
        {visibleChildren}
        {renderTrigger(handleExpand)}
      </>
    </ConditionalRender>
  );
};

Collapsible.propTypes = {
  onExpand: PropTypes.func,
  renderTrigger: PropTypes.func,
  visibleAmount: PropTypes.number,
  children: PropTypes.node,
};

export default Collapsible;
