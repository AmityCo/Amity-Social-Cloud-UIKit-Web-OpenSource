import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Avatar from '~/core/components/Avatar';
import ChevronLeftIcon from '~/icons/ChevronLeft';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.25rem 0.25rem 0px 0px;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  background: ${({ theme }) => theme.palette.system.background};
`;

const LinkAndTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 1rem;
`;

const Title = styled.div`
  ${({ theme }) => theme.typography.headline}
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.palette.base.shade2};
  &:focus {
    outline: none;
  }
  & > svg {
    margin-right: 5px;
  }
`;

interface PageHeaderProps {
  title?: React.ReactNode;
  avatarFileUrl?: string;
  avatarImage?: string;
  backLinkText?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader = ({
  title,
  avatarFileUrl,
  avatarImage,
  backLinkText,
  onBack,
}: PageHeaderProps) => (
  <HeaderContainer>
    <Avatar avatar={avatarFileUrl} backgroundImage={avatarImage} />
    <LinkAndTitle>
      {onBack instanceof Function && (
        <BackButton data-qa-anchor="page-header-back-button" onClick={onBack}>
          <ChevronLeftIcon height=".9em" />
          {backLinkText ?? <FormattedMessage id="backTitle" />}
        </BackButton>
      )}
      <Title>{title}</Title>
    </LinkAndTitle>
  </HeaderContainer>
);

export default PageHeader;
