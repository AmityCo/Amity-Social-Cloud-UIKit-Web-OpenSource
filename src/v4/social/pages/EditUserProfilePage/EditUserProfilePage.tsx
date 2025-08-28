import React, { useEffect, useRef, useState } from 'react';
import styles from './EditUserProfilePage.module.css';
import Camera from '~/v4/icons/Camera';
import { Form } from 'react-aria-components';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Title } from '~/v4/social/elements/Title/Title';
import { Button as CoreButton } from '~/v4/core/natives/Button/Button';
import { UpdateUserProfileButton } from '~/v4/social/elements/UpdateUserProfileButton';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useMutation } from '@tanstack/react-query';
import { FileRepository, UserRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { UnderlineInput } from '~/v4/social/internal-components/UnderlineInput';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNetworkState } from 'react-use';
import InputText from '~/v4/core/components/InputText';
import { Button, Typography } from '~/v4/core/components';
import Switch from '~/core/components/Switch';
import Select from '~/core/components/Select';

interface EditUserProfilePageProps {
  userId: string;
}

const MAX_DISPLAY_NAME_LENGTH = 100;
const MAX_ABOUT_LENGTH = 180;

export const EditUserProfilePage: React.FC<EditUserProfilePageProps> = ({ userId }) => {
  const pageId = 'edit_user_profile_page';
  const notification = useNotifications();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { themeStyles } = useAmityPage({ pageId });
  const { onBack } = useNavigation();
  const { online } = useNetworkState();
  const { confirm, info } = useConfirmContext();
  const { user } = useUser({ userId });

  const [displayName, setDisplayName] = useState(user?.displayName || undefined);
  const [description, setDescription] = useState(user?.description || undefined);
  const [image, setImage] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<Amity.File<'image'> | null>(null);

  useEffect(() => {
    user?.displayName && setDisplayName(user.displayName);
    user?.description && setDescription(user.description);
  }, [user?.displayName, user?.description]);

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('files', image);
    try {
      const { data } = await FileRepository.uploadImage(formData);
      setNewImage(data[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.IMAGE_NUDITY)) {
        info({
          pageId: pageId,
          type: 'info',
          title: 'Inappropriate image',
          content: 'Please choose a different image to upload.',
        });
      } else {
        info({
          pageId: pageId,
          type: 'info',
          title: 'Failed to upload image',
          content: 'Please try again.',
        });
      }
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage(image);
    }
  }, [image]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  const useMutateEditUserProfile = () =>
    useMutation({
      mutationFn: async (params: Parameters<typeof UserRepository.updateUser>[1]) => {
        return await UserRepository.updateUser(userId, params);
      },
      onSuccess: () => {
        onBack();
        notification.success({ content: 'Successfully updated your profile!' });
      },
      onError: (error) => {
        if (
          error.message === 'Amity SDK (400301): Only administrator can update user display name.'
        ) {
          notification.error({ content: 'Only administrator can update user display name.' });
          return;
        }
        notification.error({ content: 'Failed to save your profile. Please try again.' });
      },
    });

  const { mutateAsync: mutateUpdateEditUserProfile, isPending } = useMutateEditUserProfile();

  const submitForm = (e: any) => {
    const updatedValue = {
      displayName: displayName !== user?.displayName ? displayName : undefined,
      description: description !== user?.description ? description : undefined,
      avatarFileId: newImage?.fileId,
    };
    e.preventDefault();
    if (!online) {
      notification.info({ content: 'Failed to save your profile. Please try again.' });
      return;
    }
    user?.userId && mutateUpdateEditUserProfile(updatedValue);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    fileInput.click();
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setImage(e.target.files?.[0] || null);
  };

  const isNoEditing =
    !displayName ||
    ((user?.displayName === displayName || (user?.displayName == undefined && displayName == '')) &&
      (user?.description === description ||
        (user?.description == undefined && description == '')) &&
      !newImage);

  const onPressBackButton = () => {
    if (!isNoEditing)
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: 'Unsaved changes',
        content:
          'Are you sure you want to discard the changes? They will be lost when you leave this page.',
        onOk: () => {
          onBack();
        },
        okText: 'Discard',
        cancelText: 'Cancel',
      });
    else onBack();
  };

  return (
    <div className={styles.editUserProfilePage} style={themeStyles}>
      <div className={styles.editUserProfilePage__topSection}>
        <BackButton
          pageId={pageId}
          onPress={onPressBackButton}
          defaultClassName={styles.editUserProfilePage__topSection__backButton}
        />
        <Title
          pageId={pageId}
          componentId={userId}
          titleClassName={styles.editUserProfilePage__topSection__title}
        />
      </div>
      <Form onSubmit={submitForm} className={styles.editUserProfilePage__form}>
        <div className={styles.editUserProfilePage__cardPositioner}>
          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <div className={styles.editUserProfilePage__avatarContainer}>
                {newImage ? (
                  <img
                    src={newImage.fileUrl}
                    alt="avatar"
                    className={styles.editUserProfilePage__avatar}
                  />
                ) : (
                  <UserAvatar
                    userId={userId}
                    className={styles.editUserProfilePage__avatar}
                    textPlaceholderClassName={styles.editUserProfilePage__avatarPlaceholder}
                  />
                )}
                <CoreButton
                  className={styles.editUserProfilePage__avatarOverlay}
                  onPress={triggerFileInput}
                >
                  <Camera className={styles.editUserProfilePage__icon} />
                  <input
                    type="file"
                    onChange={onChangeImage}
                    multiple
                    id="image-upload"
                    accept="image/png,image/jpg"
                    className={styles.editUserProfilePage__imageInput}
                  />
                </CoreButton>
              </div>
            </div>
          </div>

          {/* <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <UnderlineInput
                name="userDisplayName"
                pageId={pageId}
                elementId="user_display_name_title"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDisplayName(e.target.value)
                }
                showCounter={true}
                // TODO: Add condition to disable/enable the input when we have sdk api to check the user setting
                // disabled={true}
              />
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <UnderlineInput
                name="userAbout"
                pageId={pageId}
                elementId="user_about_title"
                maxLength={MAX_ABOUT_LENGTH}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                showCounter={true}
                optional={true}
              />
            </div>
          </div> */}

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.SubTitleBold>La tua Bio</Typography.SubTitleBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <InputText invalid onChange={() => console.log('')} />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <InputText
                placeholder="NOME"
                value="NOME"
                floatingPlaceholder
                onChange={() => console.log('')}
              />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <InputText
                value="Value of textarea"
                placeholder="Tell us about yourself"
                multiline={true}
                floatingPlaceholder={true}
                onChange={() => console.log('')}
              />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={false} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.SubTitleBold>Preferenze di gioco</Typography.SubTitleBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div>
                <Button type="button" onClick={() => console.log('BUTTON')} variant="primary">
                  Gioco 1
                </Button>
                <Button
                  disabled
                  type="button"
                  onClick={() => console.log('BUTTON')}
                  variant="primary"
                >
                  Gioco 1
                </Button>
                <Button type="button" onClick={() => console.log('BUTTON')} variant="secondary">
                  Gioco 2
                </Button>
                <Button
                  disabled
                  type="button"
                  onClick={() => console.log('BUTTON')}
                  variant="secondary"
                >
                  Gioco 2
                </Button>
                <Button type="button" onClick={() => console.log('BUTTON')} variant="ghost">
                  Gioco 3
                </Button>
                <Button
                  disabled
                  type="button"
                  onClick={() => console.log('BUTTON')}
                  variant="ghost"
                >
                  Gioco 3
                </Button>
                <Button type="button" onClick={() => console.log('BUTTON')} context="registration">
                  Gioco 4
                </Button>
                <Button
                  disabled
                  type="button"
                  onClick={() => console.log('BUTTON')}
                  context="registration"
                >
                  Gioco 4
                </Button>
                <Button
                  type="button"
                  onClick={() => console.log('BUTTON')}
                  context="registration"
                  variant="secondary"
                >
                  Gioco 4
                </Button>
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={false} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.SubTitleBold>La tua città</Typography.SubTitleBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <Select />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={false} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.SubTitleBold>I tuoi interessi</Typography.SubTitleBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 1</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 2</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 3</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 4</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 5</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 6</div>
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={false} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.SubTitleBold>I tuoi obiettivi</Typography.SubTitleBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 1</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 2</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 3</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 4</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 5</div>
                <div className={styles.editUserProfilePage__segmentedControl}>GIOCO 6</div>
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={true} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.SubTitleBold>Che tipo di giocatore sei?</Typography.SubTitleBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <InputText multiline onChange={() => console.log('')} />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={false} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <UpdateUserProfileButton pageId={pageId} disabled={isNoEditing || isPending} />
        </div>
      </Form>
    </div>
  );
};
