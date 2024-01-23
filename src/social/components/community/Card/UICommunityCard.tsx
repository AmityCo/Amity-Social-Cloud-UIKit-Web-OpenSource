import React from 'react';

import millify from 'millify';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';

import Skeleton from '~/core/components/Skeleton';

import {
  CategoriesList,
  CommunityName,
  Container,
  Content,
  Count,
  Cover,
  CoverContent,
  Description,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UICommunityCardProps {
  avatarFileUrl?: string;
  community?: Amity.Community | null;
  communityCategories?: Amity.Category[];
  membersCount?: number;
  description?: string;
  isOfficial?: boolean;
  isPublic?: boolean;
  name?: string;
  loading?: boolean;
  onClick?: (communityId: string) => void;
}

const UICommunityCard = ({
  avatarFileUrl,
  community,
  communityCategories,
  membersCount,
  description,
  onClick,
  isOfficial,
  isPublic,
  name,
  loading,
  ...props
}: UICommunityCardProps) => {
  const handleClick = () => community?.communityId && onClick?.(community.communityId);

  return (
    <Container onClick={handleClick} {...props}>
      <Cover backgroundImage={avatarFileUrl}>
        <CoverContent>
          <CommunityName
            isOfficial={isOfficial}
            isPublic={isPublic}
            isTitle
            name={name}
            truncate={2}
          />
          <Truncate lines={1}>
            <CategoriesList>
              {(communityCategories || []).map((category) => category.name).join(', ')}
            </CategoriesList>
          </Truncate>
        </CoverContent>
      </Cover>

      <Content>
        {loading && <Skeleton style={{ fontSize: 8 }} />}

        {!loading && (
          <Count>
            {millify(membersCount || 0)}{' '}
            <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
          </Count>
        )}

        {!loading && description ? (
          <Truncate lines={2}>
            <Description>{description}</Description>
          </Truncate>
        ) : null}
      </Content>
    </Container>
  );
};

export default (props: UICommunityCardProps) => {
  const CustomComponentFn = useCustomComponent<UICommunityCardProps>('UICommunityCard');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UICommunityCard {...props} />;
};
