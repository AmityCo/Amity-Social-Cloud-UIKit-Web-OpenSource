import React, { useEffect, useRef, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import styles from './CreateUserProfilePage.module.css';
import Camera from '~/v4/icons/Camera';
import { Form } from 'react-aria-components';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Title } from '~/v4/social/elements/Title/Title';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button/Button';
import { UpdateUserProfileButton } from '~/v4/social/elements/UpdateUserProfileButton';
import { MainLayout } from '~/v4/social/layouts/Main';
import { CommunitySideBar } from '~/v4/social/components/CommunitySideBar';
import { useMutation } from '@tanstack/react-query';
import { Client, FileRepository, UserRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { UnderlineInput } from '~/v4/social/internal-components/UnderlineInput';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNetworkState } from 'react-use';

export interface CreateUserProfilePageProps {
  /**
   * The userId to create / sign in as. The profile is created on the network
   * the first time this user logs in. Required because the page performs the
   * real (signed-in) login on save.
   */
  userId: string;
  /**
   * Optional auth token to use for the signed-in login, when the network uses
   * secure mode. Mirrors `getAuthToken` on AmityUIKitProvider.
   */
  authToken?: string;
  /**
   * Fired after the profile is successfully created and the user is signed in.
   * Receives the created userId and the chosen displayName. The client decides
   * what to render next (e.g. swap to the main UIKit).
   */
  onCreated?: (user: { userId: string; displayName: string }) => void;
  /**
   * Fired when the user dismisses the create-profile flow without creating.
   */
  onCancel?: () => void;
}

const MAX_DISPLAY_NAME_LENGTH = 100;
const MAX_ABOUT_LENGTH = 180;

export const CreateUserProfilePage: React.FC<CreateUserProfilePageProps> = ({
  userId,
  authToken,
  onCreated,
  onCancel,
}) => {
  const pageId = 'create_user_profile_page';
  const notification = useNotifications();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { themeStyles } = useAmityPage({ pageId });
  const { online } = useNetworkState();
  const { info } = useConfirmContext();

  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<Amity.File<'image'> | null>(null);

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('files', image);
    try {
      const { data } = await FileRepository.uploadImage(formData);
      setNewImage(data[0]);
    } catch (error) {
      // This runs inside an async callback (not during render), so it must use
      // resolveString (a plain function), never useString (a hook).
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.IMAGE_NUDITY)) {
        info({
          pageId: pageId,
          type: 'info',
          title: resolveString('amity_social_button_inappropriate_image'),
          content: resolveString('amity_social_modal_dialog_image_upload_error'),
        });
      } else {
        info({
          pageId: pageId,
          type: 'info',
          title: resolveString('amity_social_upload_image_failed'),
          content: resolveString('amity_social_label_please_try_again'),
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

  // useMutation must be called directly at the top level of the component so the
  // hook keeps a stable position across renders. Wrapping it in a function and
  // invoking that during render is a Rules-of-Hooks violation and crashes on the
  // re-render that mutate() triggers (pending -> settled).
  const { mutateAsync: mutateCreateUserProfile, isPending } = useMutation({
    mutationFn: async () => {
      // Logging in with a userId creates the user on the network if it does
      // not exist yet, and sets the initial display name. This is the
      // transition from visitor -> signed-in user.
      await Client.login(
        {
          userId,
          displayName: displayName || undefined,
          authToken,
        },
        {
          sessionWillRenewAccessToken: (renewal) => {
            renewal.renew();
          },
        },
      );

      // Apply the remaining profile fields (about + avatar) now that the user
      // is signed in. displayName was already set during login.
      const params: Parameters<typeof UserRepository.updateUser>[1] = {
        description: description || undefined,
        avatarFileId: newImage?.fileId,
      };

      if (params.description != null || params.avatarFileId != null) {
        await UserRepository.updateUser(userId, params);
      }

      return { userId, displayName: displayName || '' };
    },
    // Note: these callbacks run during a mutation event, not during render, so
    // they must use resolveString (a plain function), never useString (a hook).
    onSuccess: (createdUser) => {
      notification.success({
        content: resolveString('amity_social_toast_snackbar_profile_updated'),
      });
      onCreated?.(createdUser);
    },
    onError: (error) => {
      if (error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
        notification.info({
          content: resolveString('amity_social_user_profile_blocked_word_error'),
        });
        return;
      }
      notification.info({
        content: resolveString('amity_social_toast_snackbar_profile_save_failed'),
      });
    },
  });

  const submitForm = (e: any) => {
    e.preventDefault();
    if (!online) {
      notification.info({
        content: resolveString('amity_social_toast_snackbar_profile_save_failed'),
      });
      return;
    }
    mutateCreateUserProfile();
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('create-profile-image-upload') as HTMLInputElement;
    fileInput.click();
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setImage(e.target.files?.[0] || null);
  };

  // A display name is the minimum requirement to create a profile.
  const isSaveDisabled = !displayName || isPending;

  const content = (
    <div className={styles.createUserProfilePage} style={themeStyles}>
      <div className={styles.createUserProfilePage__topSection}>
        {onCancel && (
          <Button
            className={styles.createUserProfilePage__topSection__cancelButton}
            onPress={onCancel}
          >
            <Typography.Body>
              {useString('amity_social_modal_dialog_cancel_button')}
            </Typography.Body>
          </Button>
        )}
        <Title
          pageId={pageId}
          titleClassName={styles.createUserProfilePage__topSection__title}
          textKey="amity_social_button_create_profile"
        />
      </div>
      <div className={styles.createUserProfilePage__container}>
        <div className={styles.createUserProfilePage__avatarContainer}>
          {newImage ? (
            <img
              src={newImage.fileUrl}
              alt="avatar"
              className={styles.createUserProfilePage__avatar}
            />
          ) : (
            <div className={styles.createUserProfilePage__avatarPlaceholder} />
          )}
          <Button
            className={styles.createUserProfilePage__avatarOverlay}
            onPress={triggerFileInput}
          >
            <Camera className={styles.createUserProfilePage__icon} />
            <input
              type="file"
              onChange={onChangeImage}
              multiple
              id="create-profile-image-upload"
              accept="image/png,image/jpg"
              className={styles.createUserProfilePage__imageInput}
            />
          </Button>
        </div>

        <Form onSubmit={submitForm} className={styles.createUserProfilePage__form}>
          <div className={styles.createUserProfilePage__fromInputWrap}>
            <UnderlineInput
              name="userDisplayName"
              pageId={pageId}
              elementId="user_display_name_title"
              textKey="amity_social_label_edit_user_display_name_title"
              maxLength={MAX_DISPLAY_NAME_LENGTH}
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDisplayName(e.target.value)
              }
              showCounter={true}
            />
            <UnderlineInput
              name="userAbout"
              pageId={pageId}
              elementId="user_about_title"
              textKey="amity_social_label_edit_user_about_title"
              maxLength={MAX_ABOUT_LENGTH}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              showCounter={true}
              optional={true}
            />
          </div>
          <UpdateUserProfileButton pageId={pageId} disabled={isSaveDisabled} />
        </Form>
      </div>
    </div>
  );

  // Render inside MainLayout so the community sidebar shows alongside the page on
  // desktop. MainLayout's CSS hides the aside automatically on mobile (< 48em),
  // so no responsive logic is needed here.
  //
  // The sidebar is shown disabled: it is visible on desktop for visual
  // continuity, but its menu items / search / notification tray are
  // non-interactive while creating a profile. Cancelling the flow is handled by
  // the host (it swaps this page for the main UIKit), so the sidebar does not
  // need to navigate anywhere from here.
  return <MainLayout aside={<CommunitySideBar disabled />}>{content}</MainLayout>;
};
