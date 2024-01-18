import React from 'react';
import Skeleton from '~/core/components/Skeleton';

import CommunityName from '~/social/components/community/Name';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { CommunityHeaderAvatar, CommunityHeaderContainer, Rest } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UICommunityHeaderProps {
  communityId: string;
  isActive?: boolean;
  avatarFileUrl?: string;
  onClick?: (communityId: string) => void;
  isOfficial?: boolean;
  isPublic?: boolean;
  isSearchResult?: boolean;
  name?: string;
  searchInput?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const UICommunityHeader = ({
  communityId,
  isActive,
  avatarFileUrl,
  onClick,
  isOfficial,
  isPublic,
  isSearchResult,
  name,
  searchInput,
  children,
  loading,
}: UICommunityHeaderProps) => (
  <CommunityHeaderContainer
    data-qa-anchor="community-header"
    isActive={isActive}
    loading={loading}
    onClick={() => onClick?.(communityId)}
  >
    <CommunityHeaderAvatar
      avatar={avatarFileUrl}
      backgroundImage={CommunityImage}
      loading={loading}
    />
    {loading && children ? (
      <Skeleton style={{ fontSize: 8, maxWidth: 120 }} />
    ) : (
      <CommunityName
        data-qa-anchor="community-header"
        isActive={isActive}
        isOfficial={isOfficial}
        isPublic={isPublic}
        isSearchResult={isSearchResult}
        name={name}
        searchInput={searchInput}
        loading={loading}
      />
    )}
    {children && <Rest>{children}</Rest>}
  </CommunityHeaderContainer>
);

export default (props: UICommunityHeaderProps) => {
  const CustomComponentFn = useCustomComponent<UICommunityHeaderProps>('UICommunityHeader');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UICommunityHeader {...props} />;
};
