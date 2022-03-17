import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Skeleton from '~/core/components/Skeleton';

import customizableComponent from '~/core/hocs/customization';

import Avatar from '~/core/components/Avatar';
import { backgroundImage as CategoryImage } from '~/icons/Category';

const CategoryHeaderContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar subtitle';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.5em;
  padding: 0.5rem;
  ${({ hasNoChildren }) =>
    hasNoChildren &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}

  ${({ theme, clickable }) =>
    clickable &&
    `
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: ${theme.palette.base.shade4};
    }`}
`;

const CategoryHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

const CategoryHeaderTitle = styled.div`
  grid-area: title;
  ${({ theme }) => theme.typography.title};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CategoryHeaderSubtitle = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
`;

const CategoryHeader = ({
  className,
  categoryId,
  name,
  avatarFileUrl,
  children,
  onClick,
  loading,
}) => {
  const handleClick = () => onClick(categoryId);
  const blockClick = (e) => e.stopPropagation();

  return (
    <CategoryHeaderContainer
      className={className}
      title={name}
      hasNoChildren={!children}
      clickable={!loading && !!onClick}
      onClick={handleClick}
    >
      <CategoryHeaderAvatar
        avatar={avatarFileUrl}
        backgroundImage={CategoryImage}
        loading={loading}
      />
      <CategoryHeaderTitle title={categoryId}>
        {loading ? <Skeleton style={{ fontSize: 12, maxWidth: 124 }} /> : name}
      </CategoryHeaderTitle>
      {children && <CategoryHeaderSubtitle onClick={blockClick}>{children}</CategoryHeaderSubtitle>}
    </CategoryHeaderContainer>
  );
};

CategoryHeader.propTypes = {
  className: PropTypes.string,
  categoryId: PropTypes.string,
  name: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default customizableComponent('CategoryHeader', CategoryHeader);
