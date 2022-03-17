import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import CommunityName from '~/social/components/community/Name';

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 118px auto;
  cursor: pointer;
  counter-increment: trending;
  min-width: 425px;
  height: 118px;
  border: 1px solid #ebecef;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.system.background};
  overflow: hidden;
`;

const Cover = styled.div`
  padding-left: 100%;

  ${({ backgroundImage, theme }) => `
    background: ${
      backgroundImage ? `url(${CSS.escape(backgroundImage)})` : theme.palette.base.shade3
    };
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  `}
`;

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const Categories = styled.span`
  &:after {
    content: ' • ';
  }
`;

const Category = styled.span`
  font: inherit;
  &:not(:first-child):before {
    content: ' ';
  }
`;

const Infos = styled.div`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.shade1};

  & > * {
    font: inherit;
  }
`;

const Description = styled.p`
  margin: 0.5rem 0 0;
  ${({ theme }) => theme.typography.caption}
`;

const TrendingCommunityName = styled(CommunityName)`
  ${({ theme }) => theme.typography.title};

  &:before {
    content: counter(trending, decimal-leading-zero);
    margin-right: 0.375em;
  }
`;

const UITrendingItem = ({
  avatarFileUrl,
  description,
  categories,
  membersCount,
  onClick,
  isOfficial,
  isPublic,
  name,
  loading,
}) => (
  <ItemContainer onClick={onClick}>
    <Cover backgroundImage={avatarFileUrl} />
    <Content>
      {loading ? (
        <>
          <Skeleton style={{ fontSize: '0.5rem', maxWidth: '7.5rem' }} />
          <div>
            <Skeleton style={{ fontSize: '0.5rem', maxWidth: '13.5rem' }} />
          </div>
          <Skeleton width="2.5rem" style={{ fontSize: '0.5rem' }} />
          <Skeleton width="2.5rem" style={{ fontSize: '0.5rem', marginLeft: '0.75rem' }} />
        </>
      ) : (
        <>
          <TrendingCommunityName isOfficial={isOfficial} isPublic={isPublic} name={name} />

          <Infos>
            <ConditionalRender condition={categories.length > 0}>
              <Truncate lines={1}>
                <Categories>
                  {categories.map((category) => (
                    <Category key={category.categoryId}>{category.name}</Category>
                  ))}
                </Categories>
              </Truncate>
            </ConditionalRender>
            <span>
              {toHumanString(membersCount)}{' '}
              <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
            </span>
          </Infos>

          {description && (
            <Truncate lines={2}>
              <Description>{description}</Description>
            </Truncate>
          )}
        </>
      )}
    </Content>
  </ItemContainer>
);

UITrendingItem.propTypes = {
  avatarFileUrl: PropTypes.string,
  description: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  membersCount: PropTypes.number,
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  name: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

UITrendingItem.defaultProps = {
  avatarFileUrl: '',
  description: '',
  categories: [],
  membersCount: 0,
  onClick: () => {},
  isOfficial: false,
  isPublic: false,
  name: '',
  loading: false,
};

export default customizableComponent('UITrendingItem', UITrendingItem);
