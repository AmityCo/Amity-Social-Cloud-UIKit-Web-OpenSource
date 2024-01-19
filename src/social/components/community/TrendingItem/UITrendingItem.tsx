import React from 'react';
import styled from 'styled-components';
import millify from 'millify';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Skeleton from '~/core/components/Skeleton';

import CommunityName from '~/social/components/community/Name';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

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

const Cover = styled.div<{ backgroundImage?: string }>`
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

interface UITrendingItemProps {
  avatarFileUrl?: string;
  description?: string;
  categories?: {
    categoryId: string;
    name: string;
  }[];
  membersCount?: number;
  isOfficial?: boolean;
  isPublic?: boolean;
  name?: string;
  loading?: boolean;
  onClick?: () => void;
}

const UITrendingItem = ({
  avatarFileUrl,
  description,
  categories = [],
  membersCount,
  onClick,
  isOfficial,
  isPublic,
  name,
  loading,
}: UITrendingItemProps) => {
  return (
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
              {categories.length > 0 && (
                <Truncate lines={1}>
                  <Categories>
                    {categories.map((category) => (
                      <Category key={category.categoryId}>{category.name}</Category>
                    ))}
                  </Categories>
                </Truncate>
              )}

              <span>
                {millify(membersCount || 0)}{' '}
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
};

export default (props: UITrendingItemProps) => {
  const CustomComponentFn = useCustomComponent<UITrendingItemProps>('UITrendingItem');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UITrendingItem {...props} />;
};
