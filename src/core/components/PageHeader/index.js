import React from 'react';
import PropTypes from 'prop-types';
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

const PageHeader = ({ title, avatarFileUrl, avatarImage, onBack }) => (
  <HeaderContainer>
    <Avatar avatar={avatarFileUrl} backgroundImage={avatarImage} />
    <LinkAndTitle>
      {onBack instanceof Function && (
        <BackButton onClick={onBack}>
          <ChevronLeftIcon height=".9em" />
          <FormattedMessage id="backTitle" />
        </BackButton>
      )}
      <Title>{title}</Title>
    </LinkAndTitle>
  </HeaderContainer>
);

PageHeader.propTypes = {
  title: PropTypes.node,
  avatarFileUrl: PropTypes.string,
  onBack: PropTypes.func,
  avatarImage: PropTypes.string,
};

PageHeader.defaultProps = {
  title: null,
  onBack: null,
  avatarImage: '',
};

export default PageHeader;
