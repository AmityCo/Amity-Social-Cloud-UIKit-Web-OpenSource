import React from 'react';
import { IconWrapper, ButtonActionItem, AnchorActionItem } from './styles';

export const ALLOWED_ELEMENTS = ['button', 'a'];

interface SideMenuActionItemProps {
  'data-qa-anchor'?: string;
  element?: 'button' | 'a';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const SideMenuActionItem = ({
  'data-qa-anchor': dataQaAnchor = '',
  icon,
  children,
  active,
  className,
  onClick,
  element = 'a',
  disabled,
}: SideMenuActionItemProps) => {
  if (element === 'a') {
    return (
      <AnchorActionItem
        data-qa-anchor={dataQaAnchor}
        className={className}
        onClick={onClick}
        active={active}
      >
        {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
        <span className="actionItemChild">{children}</span>
      </AnchorActionItem>
    );
  }

  return (
    <ButtonActionItem
      data-qa-anchor={dataQaAnchor}
      className={className}
      active={active}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <IconWrapper active={active}>{icon}</IconWrapper>}
      <span className="actionItemChild">{children}</span>
    </ButtonActionItem>
  );
};

export default SideMenuActionItem;
