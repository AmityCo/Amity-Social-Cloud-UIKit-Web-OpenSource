import React from 'react';
import Skeleton from '~/core/components/Skeleton';

import {
  CategoryHeaderAvatar,
  CategoryHeaderContainer,
  CategoryHeaderSubtitle,
  CategoryHeaderTitle,
} from './styles';

import { backgroundImage as CategoryImage } from '~/icons/Category';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface UICategoryHeaderProps {
  className?: string;
  categoryId?: string;
  name?: string;
  avatarFileUrl?: string;
  children: React.ReactNode;
  loading: boolean;
  onClick?: (categoryId: string) => void;
}

const UICategoryHeader = ({
  className,
  categoryId,
  name,
  avatarFileUrl,
  children,
  onClick,
  loading,
}: UICategoryHeaderProps) => {
  const handleClick = () => categoryId && onClick?.(categoryId);
  const blockClick: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation();

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

export default (props: UICategoryHeaderProps) => {
  const CustomComponentFn = useCustomComponent<UICategoryHeaderProps>('CategoryHeader');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UICategoryHeader {...props} />;
};
