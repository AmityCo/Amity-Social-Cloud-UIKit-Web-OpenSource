import React from 'react';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { CreatePost } from '~/v4/social/internal-components/CreatePost';
import { EditPost } from '~/v4/social/internal-components/EditPost';

export enum Mode {
  CREATE = 'create',
  EDIT = 'edit',
}
export interface AmityPostComposerEditOptions {
  mode: Mode.EDIT;
  post: Amity.Post;
  isClipPost?: boolean;
}

export interface AmityPostComposerCreateOptions {
  mode: Mode.CREATE;
  targetId: string | null;
  targetType: 'community' | 'user';
  community?: Amity.Community;
  isClipPost?: boolean;
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
    const { targetId, targetType, community, isClipPost } = props;
    return (
      <CreatePost
        mode={Mode.CREATE}
        targetId={targetId}
        targetType={targetType}
        community={community}
        isClipPost={isClipPost}
      />
    );
  } else {
    const { post, isClipPost } = props;
    return <EditPost mode={Mode.EDIT} post={post} isClipPost={isClipPost} />;
  }
}

export type CreatePostParams = {
  text: string;
  mentioned: Mentioned[];
  mentionees: Mentionees;
  attachments?: {
    fileId: string;
    type: string;
  }[];
};
