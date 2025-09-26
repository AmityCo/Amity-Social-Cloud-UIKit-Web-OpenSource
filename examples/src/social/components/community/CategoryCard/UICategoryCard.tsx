import React from 'react';

import Truncate from 'react-truncate-markup';

import Skeleton from '~/core/components/Skeleton';

import { Container, Content, Name } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useImage from '~/core/hooks/useImage';

interface UICategoryCardProps {
  className?: string;
  categoryId?: string;
  name?: string;
  avatarFileUrl?: string;
  avatarFileId?: string;
  onClick?: (categoryId: string) => void;
  loading?: boolean;
}

const UICategoryCard = ({
  categoryId,
  name,
  avatarFileUrl,
  avatarFileId,
  onClick,
  loading,
  ...props
}: UICategoryCardProps) => {
  const handleClick = () => categoryId && onClick?.(categoryId);

  const avatarFileUrlFromFileId = useImage({ fileId: avatarFileId });

  const fileUrl = avatarFileUrl || avatarFileUrlFromFileId;

  return (
    <Container backgroundImage={fileUrl || undefined} onClick={handleClick} {...props}>
      <Content>
        {loading && <Skeleton style={{ fontSize: 16 }} />}
        {!loading && (
          <Truncate lines={2}>
            <Name>{name}</Name>
          </Truncate>
        )}
      </Content>
    </Container>
  );
};

export default (props: UICategoryCardProps) => {
  const CustomComponentFn = useCustomComponent<UICategoryCardProps>('UICategoryCard');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UICategoryCard {...props} />;
};
