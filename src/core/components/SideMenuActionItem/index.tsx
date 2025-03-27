import React from 'react';
import { IconWrapper, ButtonActionItem, AnchorActionItem } from './styles';

export const ALLOWED_ELEMENTS = ['button', 'a'];

interface SideMenuActionItemProps {
  'data-testid'?: string;
  element?: 'button' | 'a';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const SideMenuActionItem = ({
  'data-testid': dataQaAnchor = '',
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
        data-testid={dataQaAnchor}
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
      data-testid={dataQaAnchor}
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
