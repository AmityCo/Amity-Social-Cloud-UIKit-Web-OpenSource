import { type MutableRefObject } from 'react';
import { PollContent } from '~/v4/social/components/PostContent/PollContent';
import {
  PostMediaElement,
  type PostMediaControls,
} from '~/v4/social/features/posts/elements/PostMediaElement';
import { ClipContent } from '~/v4/social/components/PostContent/ClipContent';
import { LiveStreamContent } from '~/v4/social/components/PostContent/LiveStreamContent';
import type { FrameRatio } from '~/v4/social/features/posts/utils/getFrameRatio';

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
  mediaControlsRef?: MutableRefObject<PostMediaControls | null>;
  mediaRatioOverride?: FrameRatio;
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
  mediaControlsRef,
  mediaRatioOverride,
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
      <PostMediaElement
        pageId={pageId}
        componentId={componentId}
        posts={post.childrenPosts ?? []}
        onImageClick={onImageClick}
        onVideoClick={onVideoClick}
        parentPostId={post.postId}
        controlsRef={mediaControlsRef}
        ratioOverride={mediaRatioOverride}
      />
      <LiveStreamContent
        pageId={pageId}
        posts={post.childrenPosts as Amity.Post<'room'>[]}
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
