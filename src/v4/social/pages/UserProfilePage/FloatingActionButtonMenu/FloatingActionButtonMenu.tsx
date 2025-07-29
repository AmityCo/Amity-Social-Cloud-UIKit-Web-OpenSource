import React, { FC, ReactNode, useEffect } from 'react';
import styles from './FloatingActionButtonMenu.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CreatePost } from '~/v4/icons/CreatePost';
import CreatePoll from '~/v4/icons/CreatePoll';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { CreateClip } from '~/v4/icons/CreateClip';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { FileTrigger } from 'react-aria-components';
import { PollTypeSelection } from '~/v4/social/components/PollTypeSelection';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

type FloatingActionButtonMenuProps = {
  onPressMenu?: () => void;
  userId: string;
};

export const FloatingActionButtonMenu: FC<FloatingActionButtonMenuProps> = ({
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

  const menus: {
    id: string;
    label: string;
    icon: ReactNode;
    onPress: () => void;
  }[] = [
    {
      id: 'post',
      label: 'Post',
      icon: <CreatePost className={styles.floatingActionButtonMenu__icon} />,
      onPress: () =>
        goToPostComposerPage({ mode: Mode.CREATE, targetId: null, targetType: 'user' }),
    },
    {
      id: 'poll',
      label: 'Poll',
      icon: <CreatePoll className={styles.floatingActionButtonMenu__icon} />,
      onPress: () => {
        setDrawerData({
          content: (
            <PollTypeSelection targetId={null} targetType="user" onClickNext={removeDrawerData} />
          ),
        });
      },
    },
  ];

  return (
    <div className={styles.floatingActionButtonMenu}>
      {menus.map((menu) => (
        <Button
          key={menu.id}
          className={styles.floatingActionButtonMenu__button}
          onPress={() => {
            onPressMenu?.();
            menu.onPress();
          }}
        >
          {menu.icon}
          <Typography.BodyBold className={styles.floatingActionButtonMenu__label}>
            {menu.label}
          </Typography.BodyBold>
        </Button>
      ))}
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
        <Button className={styles.floatingActionButtonMenu__button}>
          <CreateClip className={styles.floatingActionButtonMenu__icon} />
          <Typography.BodyBold className={styles.floatingActionButtonMenu__label}>
            Clip
          </Typography.BodyBold>
        </Button>
      </FileTrigger>
    </div>
  );
};
