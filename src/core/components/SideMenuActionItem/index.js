import React from 'react';
import PropTypes from 'prop-types';
import { IconWrapper, ButtonActionItem, AnchorActionItem } from './styles';

export const ALLOWED_ELEMENTS = ['button', 'a'];

const ActionItemComponents = {
  a: AnchorActionItem,
  button: ButtonActionItem,
};

const SideMenuActionItem = ({ icon, children, active, className, onClick, element = 'a' }) => {
  const ActionItemContainer = ActionItemComponents[element];
  return (
    <ActionItemContainer onClick={onClick} className={className} active={active}>
      {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
      <span className="actionItemChild">{children}</span>
    </ActionItemContainer>
  );
};

SideMenuActionItem.propTypes = {
  element: PropTypes.oneOf(ALLOWED_ELEMENTS),
  icon: PropTypes.node,
  children: PropTypes.node,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default SideMenuActionItem;
