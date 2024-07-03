import React, { useEffect, useRef, useState } from 'react';
import styles from './PostComposerPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CreateNewPostButton } from '~/v4/social/elements/CreateNewPostButton';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { PostRepository } from '@amityco/ts-sdk';
import { LexicalEditor } from 'lexical';
import { useMutation } from '@tanstack/react-query';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Notification } from '~/v4/core/components/Notification';
import { Spinner } from '../../internal-components/Spinner';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { useForm } from 'react-hook-form';
import { Mentioned } from '~/v4/helpers/utils';
import { Drawer } from 'vaul';
import { MediaAttachment } from '../../components/MediaAttachment';
import { DetailedMediaAttachment } from '../../components/DetailedMediaAttachment';
import ReactDOM from 'react-dom';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

export enum Mode {
  CREATE = 'create',
  EDIT = 'edit',
}
interface AmityPostComposerEditOptions {
  mode: Mode.EDIT;
  post: Amity.Post;
}

interface AmityPostComposerCreateOptions {
  mode: Mode.CREATE;
  targetId?: string | null;
  targetType: 'community' | 'user';
  community?: Amity.Community;
}

export interface MetaData {
  index: number;
  length: number;
  type: string;
  userId?: string;
}

type PostComposerPageProps = AmityPostComposerCreateOptions | AmityPostComposerEditOptions;

const isCreatePage = (props: PostComposerPageProps): props is AmityPostComposerCreateOptions => {
  return props.mode === Mode.CREATE;
};

export function PostComposerPage(props: PostComposerPageProps) {
  if (isCreatePage(props)) {
    const { targetId, targetType, community } = props;
    return (
      <CreateInternal
        mode={Mode.CREATE}
        targetId={targetId}
        targetType={targetType}
        community={community}
      />
    );
  } else {
    return null;
  }
}

export type createPostParams = {
  text: string;
  mentioned: Mentioned[];
  mentionees: {
    type: string;
    userIds: string[];
  }[];
};

const CreateInternal = ({ community, targetType, targetId }: AmityPostComposerCreateOptions) => {
  const pageId = 'post_composer_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  // const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU = '290px'; //Including file button
  const HEIGHT_MEDIA_ATTACHMENT_MENU = '92px';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU = '236px'; //Not including file button

  const { onBack } = useNavigation();
  const editorRef = useRef<LexicalEditor | null>(null);
  const { AmityPostComposerPageBehavior } = usePageBehavior();
  const [snap, setSnap] = useState<number | string | null>(HEIGHT_MEDIA_ATTACHMENT_MENU);
  const [isShowBottomMenu, setIsShowBottomMenu] = useState<boolean>(true);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { confirm } = useConfirmContext();

  const [textValue, setTextValue] = useState<createPostParams>({
    text: '',
    mentioned: [],
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
  });

  const useMutateCreatePost = () =>
    useMutation({
      mutationFn: async () => {
        return PostRepository.createPost({
          targetId: targetId,
          targetType: targetType,
          data: { text: textValue.text },
          dataType: 'text',
          metadata: { mentioned: textValue.mentioned },
          mentionees: textValue.mentionees,
        });
      },
      onSuccess: () => {
        AmityPostComposerPageBehavior.goToSocialHomePage();
      },
      onError: (error) => {
        console.error('Failed to create post', error);
      },
    });

  const { mutateAsync: mutateCreatePostAsync, isPending, isError } = useMutateCreatePost();

  const { handleSubmit } = useForm();

  const onSubmit = () => {
    mutateCreatePostAsync();
  };

  const onChange = (val: createPostParams) => {
    setTextValue(val);
  };

  const handleSnapChange = (newSnap: string | number | null) => {
    if (snap === HEIGHT_MEDIA_ATTACHMENT_MENU && newSnap === '0px') {
      return;
    }
    setSnap(newSnap);
  };

  const onClickClose = () => {
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently deleted. It cannot be undone.',
      onOk: () => {
        AmityPostComposerPageBehavior.goToSocialHomePage();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  return (
    <div className={styles.postComposerPage} style={themeStyles}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={
          snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU
            ? styles.postComposerPage__formShort
            : styles.postComposerPage__formLong
        }
      >
        <div className={styles.postComposerPage__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <CommunityDisplayName pageId={pageId} community={community} />
          <CreateNewPostButton
            pageId={pageId}
            onSubmit={handleSubmit(onSubmit)}
            isValid={textValue.text.length > 0}
          />
        </div>
        <PostTextField ref={editorRef} onChange={onChange} />
      </form>
      <div ref={drawerRef}></div>
      {drawerRef.current
        ? ReactDOM.createPortal(
            <Drawer.Root
              snapPoints={[HEIGHT_MEDIA_ATTACHMENT_MENU, HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU]}
              activeSnapPoint={snap}
              setActiveSnapPoint={handleSnapChange}
              open={isShowBottomMenu}
              modal={false}
            >
              <Drawer.Portal container={drawerRef.current}>
                <Drawer.Content className={styles.drawer__content}>
                  <div className={styles.postComposerPage__notiWrap}>
                    {isPending && (
                      <Notification
                        content="Posting..."
                        icon={<Spinner />}
                        className={styles.postComposerPage__status}
                      />
                    )}
                    {isError && (
                      <Notification
                        content="Failed to create post"
                        icon={<ExclamationCircle className={styles.selectPostTargetPag_infoIcon} />}
                        className={styles.postComposerPage__status}
                      />
                    )}
                  </div>
                  {snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU ? (
                    <DetailedMediaAttachment pageId={pageId} />
                  ) : (
                    <MediaAttachment pageId={pageId} />
                  )}
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>,
            drawerRef.current,
          )
        : null}
    </div>
  );
};
