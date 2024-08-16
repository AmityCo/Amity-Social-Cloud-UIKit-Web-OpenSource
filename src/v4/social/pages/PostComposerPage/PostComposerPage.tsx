import React from 'react';
import { Mentioned } from '~/v4/helpers/utils';
import { CreatePost } from '~/v4/social/internal-components/CreatePost';
import { EditPost } from '~/v4/social/internal-components/EditPost';

export enum Mode {
  CREATE = 'create',
  EDIT = 'edit',
}
export interface AmityPostComposerEditOptions {
  mode: Mode.EDIT;
  post: Amity.Post;
}

export interface AmityPostComposerCreateOptions {
  mode: Mode.CREATE;
  targetId: string | null;
  targetType: 'community' | 'user';
  community?: Amity.Community;
}

export interface MetaData {
  index: number;
  length: number;
  type: string;
  userId?: string;
}

export type PostComposerPageProps = AmityPostComposerCreateOptions | AmityPostComposerEditOptions;

const isCreatePage = (props: PostComposerPageProps): props is AmityPostComposerCreateOptions => {
  return props.mode === Mode.CREATE;
};

export function PostComposerPage(props: PostComposerPageProps) {
  if (isCreatePage(props)) {
    const { targetId, targetType, community } = props;
    return (
      <CreatePost
        mode={Mode.CREATE}
        targetId={targetId}
        targetType={targetType}
        community={community}
      />
    );
  } else {
    const { post } = props;
    return <EditPost mode={Mode.EDIT} post={post} />;
  }
}

export type CreatePostParams = {
  text: string;
  mentioned: Mentioned[];
  mentionees: {
    type: string;
    userIds: string[];
  }[];
  attachments?: {
    fileId: string;
    type: string;
  }[];
};
