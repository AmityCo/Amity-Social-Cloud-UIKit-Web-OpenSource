import React, { FC, useEffect } from 'react';
import styles from './FloatingActionButtonMenu.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { FileTrigger } from 'react-aria-components';
import { PollTypeSelection } from '~/v4/social/components/PollTypeSelection';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';
import { CreateClipButton } from '~/v4/social/elements/CreateClipButton';

type FloatingActionButtonMenuProps = {
  pageId?: string;
  onPressMenu?: () => void;
  userId: string;
};

export const FloatingActionButtonMenu: FC<FloatingActionButtonMenuProps> = ({
  pageId = '*',
  userId,
  onPressMenu,
}) => {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const navigation = useNavigation();
  const { goToPostComposerPage, goToDraftClipPage } = navigation;
  const { file, setFile } = useClipContext();

  useEffect(() => {
    if (file) {
      goToDraftClipPage?.({
        targetId: null,
        targetType: 'user',
      });
      onPressMenu?.();
    }
  }, [file]);

  return (
    <div className={styles.floatingActionButtonMenu}>
      <CreatePostButton
        pageId={pageId}
        onClick={() => {
          onPressMenu?.();
          goToPostComposerPage({ mode: Mode.CREATE, targetId: null, targetType: 'user' });
        }}
      />
      <CreatePollButton
        pageId={pageId}
        onClick={() => {
          onPressMenu?.();
          setDrawerData({
            content: (
              <PollTypeSelection targetId={null} targetType="user" onClickNext={removeDrawerData} />
            ),
          });
        }}
      />
      <FileTrigger
        acceptedFileTypes={['video/*']}
        onSelect={(e) => {
          if (e) {
            const files = Array.from(e as FileList);
            if (files.length > 0) {
              setFile(files[0]);
            }
          }
        }}
      >
        <CreateClipButton pageId={pageId} />
      </FileTrigger>
    </div>
  );
};
