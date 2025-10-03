import React from 'react';
import { PollContent } from '~/v4/social/components/PostContent/PollContent';
import { ImageContent } from '~/v4/social/components/PostContent/ImageContent';
import { VideoContent } from '~/v4/social/components/PostContent/VideoContent';
import { ClipContent } from '~/v4/social/components/PostContent/ClipContent';
import { LiveStreamContent } from '~/v4/social/components/PostContent/LiveStreamContent';

type ChildrenPostContentProps = {
  pageId?: string;
  // Parent Post
  post: Amity.Post;
  componentId?: string;
  disabledContent?: boolean;
  expandAllContent?: boolean;
  onImageClick: (imageIndex: number) => void;
  onVideoClick: (videoIndex: number) => void;
  onClipClick: (postId: string) => void;
  goToPostDetail?: () => void;
  onPollPostDeleted?: (post: Amity.Post) => void;
  forceShowPollResults?: boolean;
  community?: Amity.Community | null;
};

export const ChildrenPostContent = ({
  post,
  pageId,
  componentId,
  community,
  onImageClick,
  onVideoClick,
  onClipClick,
  goToPostDetail,
  onPollPostDeleted,
  forceShowPollResults,
  disabledContent = false,
  expandAllContent = false,
}: ChildrenPostContentProps) => {
  return (
    <>
      <PollContent
        pageId={pageId}
        componentId={componentId}
        parentPost={post}
        posts={post.childrenPosts as Amity.Post<'poll'>[]}
        disabled={disabledContent}
        onPostDeleted={onPollPostDeleted}
        forceShowResults={forceShowPollResults}
        expandOption={expandAllContent}
        community={community}
      />
      <ImageContent
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts as Amity.Post<'image'>[]}
        onImageClick={onImageClick}
      />
      <VideoContent
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts as Amity.Post<'video'>[]}
        onVideoClick={onVideoClick}
      />
      <LiveStreamContent
        posts={post.childrenPosts as Amity.Post<'liveStream'>[]}
        goToPostDetail={goToPostDetail}
        parentPost={post}
      />
      <ClipContent
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts as Amity.Post<'clip'>[]}
        onClipClick={onClipClick}
      />
    </>
  );
};
