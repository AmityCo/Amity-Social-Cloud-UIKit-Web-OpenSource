import React from 'react';
import { StyledLink, StyledLinkIcon } from './styles';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: React.ReactNode;
}

export const HyperLink: React.FC<LinkButtonProps> = ({
  href,
  children,
  icon = <StyledLinkIcon name="LinkIcon" size={16} />,
  ...rest
}) => {
  return (
    <StyledLink href={href} {...rest}>
      {icon && icon}
      {children}
    </StyledLink>
  );
};
