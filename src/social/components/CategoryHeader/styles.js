import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

import Avatar from '~/core/components/Avatar';
import { backgroundImage as CategoryImage } from '~/icons/Category';

const CategoryHeaderContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar subtitle';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.5em;
  padding: 1em;
  ${({ hasNoChildren }) =>
    hasNoChildren &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}
`;

const CategoryHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

const CategoryHeaderTitle = styled.div`
  grid-area: title;
  ${({ theme }) => theme.typography.title}
`;

const CategoryHeaderSubtitle = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
`;

const CategoryHeader = ({ categoryId, name, avatarFileUrl, children, onClick }) => {
  const onClickCategory = () => onClick(categoryId);
  return (
    <CategoryHeaderContainer title={name} hasNoChildren={!children}>
      <CategoryHeaderAvatar
        avatar={avatarFileUrl}
        backgroundImage={CategoryImage}
        onClick={onClickCategory}
      />
      <CategoryHeaderTitle title={categoryId} onClick={onClickCategory}>
        {name}
      </CategoryHeaderTitle>
      {children && <CategoryHeaderSubtitle>{children}</CategoryHeaderSubtitle>}
    </CategoryHeaderContainer>
  );
};

CategoryHeader.propTypes = {
  categoryId: PropTypes.string,
  name: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default customizableComponent('CategoryHeader', CategoryHeader);
