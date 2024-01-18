import React, { memo } from 'react';

import usePost from '~/social/hooks/usePost';
import UIPostHeader from './UIPostHeader';
import { usePostHeaderProps } from './hooks';
import useUser from '~/core/hooks/useUser';
import useFile from '~/core/hooks/useFile';
import useImage from '~/core/hooks/useImage';

interface PostHeaderProps {
  postId: string;
  hidePostTarget?: boolean;
  loading?: boolean;
}

const PostHeader = ({ postId, hidePostTarget, loading }: PostHeaderProps) => {
  const post = usePost(postId);
  const user = useUser(post?.postedUserId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  const postHeaderProps = usePostHeaderProps({
    post,
    avatarFileUrl,
    user,
    loading,
    hidePostTarget,
  });

  return <UIPostHeader {...postHeaderProps} />;
};

export { UIPostHeader };
export default memo(PostHeader);
