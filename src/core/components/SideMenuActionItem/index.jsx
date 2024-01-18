import React from 'react';
import PropTypes from 'prop-types';
import { IconWrapper, ButtonActionItem, AnchorActionItem } from './styles';

export const ALLOWED_ELEMENTS = ['button', 'a'];

const ActionItemComponents = {
  a: AnchorActionItem,
  button: ButtonActionItem,
};

const SideMenuActionItem = ({
  'data-qa-anchor': dataQaAnchor = '',
  icon,
  children,
  active,
  className,
  onClick,
  element = 'a',
  disabled,
}) => {
  const ActionItemContainer = ActionItemComponents[element];
  return (
    <ActionItemContainer
      data-qa-anchor={dataQaAnchor}
      className={className}
      active={active}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
      <span className="actionItemChild">{children}</span>
    </ActionItemContainer>
  );
};

SideMenuActionItem.propTypes = {
  'data-qa-anchor': PropTypes.string,
  element: PropTypes.oneOf(ALLOWED_ELEMENTS),
  icon: PropTypes.node,
  children: PropTypes.node,
  active: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SideMenuActionItem;
