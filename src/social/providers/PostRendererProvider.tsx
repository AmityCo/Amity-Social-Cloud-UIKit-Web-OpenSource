import { PostContentType } from '@amityco/ts-sdk';
import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import DefaultPostRenderer from '../components/post/Post/DefaultPostRenderer';
import UnknownPostRenderer from '../components/post/Post/UnknownPostRenderer';

export type PostRendererProps = {
  childrenPosts?: Amity.Post[];
  className?: string;
  currentUserId?: string;
  handleDeletePost?: (postId: string) => void;
  handleReportPost?: () => void;
  handleUnreportPost?: () => void;
  handleApprovePost?: () => void;
  handleDeclinePost?: () => void;
  handleClosePoll?: () => void;
  poll?: Amity.Poll | null;
  isPollClosed?: boolean;
  hidePostTarget?: boolean;
  isFlaggedByMe?: boolean;
  readonly?: boolean;
  post?: Amity.Post;
  user?: Amity.User | null;
  userRoles?: string[];
  loading?: boolean;
  avatarFileUrl?: string;
};

export type PostRendererConfigType = Record<
  ValueOf<typeof PostContentType> | string,
  (props: PostRendererProps) => ReactNode
>;

const defaultPostRenderer: PostRendererConfigType = {
  [PostContentType.FILE]: (props: PostRendererProps) => <DefaultPostRenderer {...props} />,
  [PostContentType.IMAGE]: (props: PostRendererProps) => <DefaultPostRenderer {...props} />,
  [PostContentType.LIVESTREAM]: (props: PostRendererProps) => <DefaultPostRenderer {...props} />,
  [PostContentType.POLL]: (props: PostRendererProps) => <DefaultPostRenderer {...props} />,
  [PostContentType.TEXT]: (props: PostRendererProps) => <DefaultPostRenderer {...props} />,
  [PostContentType.VIDEO]: (props: PostRendererProps) => <DefaultPostRenderer {...props} />,
};

const PostRendererContext = createContext(defaultPostRenderer);

export const usePostRenderer = (dataType?: string) => {
  const postRendererConfig = useContext(PostRendererContext);

  return useMemo(() => {
    if (dataType == null) return (_props: PostRendererProps) => null;

    return (
      postRendererConfig[dataType] ||
      defaultPostRenderer[dataType] ||
      ((_props: PostRendererProps) => <UnknownPostRenderer />)
    );
  }, [dataType]);
};

interface PostRendererProviderProps {
  children: ReactNode;
  config?: typeof defaultPostRenderer;
}

export default function PostRendererProvider({ children, config }: PostRendererProviderProps) {
  const value = useMemo(() => {
    if (config == null) return defaultPostRenderer;

    return { ...defaultPostRenderer, ...config };
  }, [config]);

  return <PostRendererContext.Provider value={value}>{children}</PostRendererContext.Provider>;
}
