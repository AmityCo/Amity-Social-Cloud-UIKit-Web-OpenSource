import React, { useState, useCallback } from 'react';
import clsx from 'clsx';

import useSize, { SIZE_ALIAS } from '~/core/hooks/useSize';

import { AvatarContainer, Img, AvatarOverlay } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

export interface AvatarProps {
  id?: string;
  className?: string;
  avatar?: string | null;
  showOverlay?: boolean;
  size?: ValueOf<typeof SIZE_ALIAS> | null;
  onClick?: () => void;
  loading?: boolean;
  backgroundImage?: string | null;
}

const Avatar = ({
  className = '',
  avatar = null,
  showOverlay,
  size,
  onClick,
  loading,
  ...props
}: AvatarProps) => {
  const [visible, setVisible] = useState(false);

  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);
  const sizeValue = useSize(size);

  return (
    <AvatarContainer
      className={clsx(className, { visible: visible, clickable: !!onClick })}
      loading={loading}
      size={sizeValue}
      onClick={onClick}
      {...props}
    >
      {avatar ? (
        showOverlay ? (
          <AvatarOverlay size={sizeValue} {...props}>
            <Img src={avatar} onError={onError} onLoad={onLoad} />
          </AvatarOverlay>
        ) : (
          <Img src={avatar} onError={onError} onLoad={onLoad} />
        )
      ) : null}
    </AvatarContainer>
  );
};

export default (props: AvatarProps) => {
  const CustomComponentFn = useCustomComponent<AvatarProps>('Avatar');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Avatar {...props} />;
};
