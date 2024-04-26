import styled from 'styled-components';
import { Icon } from '~/v4/core/components/Icon';

export const StyledLink = styled.a`
  border: ${({ theme }) => `1px solid ${theme.v4.colors.base.shade4}`};
  color: ${({ theme }) => theme.v4.colors.secondary.default};
  background: ${({ theme }) => theme.v4.colors.hyperlink.default};
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1rem 0.625rem 0.75rem;
  border-radius: 1.5rem;
  transition: background-color 0.3s, color 0.3s;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.25rem;
  letter-spacing: -0.015rem;
  gap: 0.5rem;
`;

export const StyledLinkIcon = styled(Icon)`
  fill: ${({ theme }) => theme.v4.colors.primary.default};
`;
