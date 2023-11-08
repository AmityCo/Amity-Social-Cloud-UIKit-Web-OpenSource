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
  margin-left: 0px;
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
  font-size: 14px;
  &:focus {
    outline: none;
  }
  & > svg {
    margin-right: 5px;
  }
`;

const PageHeader = ({ title, avatarFileUrl, avatarImage, backLinkText, onBack }) => (
  <HeaderContainer>
    {/* <Avatar avatar={avatarFileUrl} backgroundImage={avatarImage} /> */}
    <LinkAndTitle>
      {onBack instanceof Function && (
        <BackButton data-qa-anchor="page-header-back-button" onClick={onBack}>
          {/* <ChevronLeftIcon height=".9em" /> */}
          <div style={{ fontSize: 16, paddingRight: 6, marginBottom: 14, marginTop: 12 }}>
            &lsaquo;{' '}
          </div>
          {backLinkText ?? <FormattedMessage id="backTitle" />}
        </BackButton>
      )}
      <Title>{title}</Title>
    </LinkAndTitle>
  </HeaderContainer>
);

PageHeader.propTypes = {
  title: PropTypes.node,
  avatarFileUrl: PropTypes.string,
  backLinkText: PropTypes.node,
  avatarImage: PropTypes.string,
  onBack: PropTypes.func,
};

PageHeader.defaultProps = {
  title: null,
  backLinkText: null,
  onBack: null,
  avatarImage: '',
};

export default PageHeader;
