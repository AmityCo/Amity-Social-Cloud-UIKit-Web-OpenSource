import React, { useEffect, useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { Title } from '~/v4/social/elements/Title';
import { BackButton, CloseButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityNameTitle } from '~/v4/social/elements/CommunityNameTitle';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { Camera } from '~/v4/icons/Camera';
import { Avatar, Typography } from '~/v4/core/components';
import { CommunityAboutTitle } from '~/v4/social/elements/CommunityAboutTitle';
import { CommunityCategoryTitle } from '~/v4/social/elements/CommunityCategoryTitle';
import { CommunityPrivacyTitle } from '~/v4/social/elements/CommunityPrivacyTitle';
import { CommunityPrivacyPrivateIcon } from '~/v4/social/elements/CommunityPrivacyPrivateIcon/';
import { CommunityPrivacyPrivateTitle } from '~/v4/social/elements/CommunityPrivacyPrivateTitle/';
import { CommunityPrivacyPrivateDescription } from '~/v4/social/elements/CommunityPrivacyPrivateDescription';
import { CommunityPrivacyPublicIcon } from '~/v4/social/elements/CommunityPrivacyPublicIcon';
import { CommunityPrivacyPublicTitle } from '~/v4/social/elements/CommunityPrivacyPublicTitle';
import { CommunityPrivacyPublicDescription } from '~/v4/social/elements/CommunityPrivacyPublicDescription';
import { CommunityCreateButton } from '~/v4/social/elements/CommunityCreateButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { isMobile } from '~/v4/social/utils/isMobile';
import { CommunityCoverImage } from '~/v4/social/internal-components/CommunityCoverImage';
import { CreateFormValues, useCreateCommunity } from '~/v4/social/hooks/useCreateCommunity';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CommunityAddMemberTitle } from '~/v4/social/elements/CommunityAddMemberTitle';
import { CommunityAddMemberButton } from '~/v4/social/elements/CommunityAddMemberButton';
import { Input, Label, TextField, TextArea, FileTrigger } from 'react-aria-components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { Clear } from '~/v4/icons/Clear';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Category } from '~/v4/icons/Category';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import { CommunityAddCategoryPage, CommunityAddMemberPage } from '~/v4/social/pages';
import { Popover } from '~/v4/core/components/AriaPopover';
import ChevronRight from '~/v4/icons/ChevronRight';
import { ChevronTop } from '~/v4/icons/ChevronTop';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import styles from './CreateCommunity.module.css';
import { useNetworkState } from 'react-use';

type CreateCommunityProps = {
  mode: AmityCommunitySetupPageMode;
};

export function CreateCommunity({ mode }: CreateCommunityProps) {
  const pageId = 'community_setup_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const MAX_LENGTH_COMMUNITY_NAME = 30;
  const MAX_LENGTH_DESC = 180;

  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { onBack, goToCommunityProfilePage } = useNavigation();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const [incomingImage, setIncomingImage] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<Amity.File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setError, watch, formState, setValue, getValues, control } =
    useCreateCommunity();

  const { errors } = formState;
  const displayName = watch('displayName');
  const description = watch('description');
  const notification = useNotifications();
  const { confirm } = useConfirmContext();
  const { online } = useNetworkState();

  const { AmityCommunitySetupPageBehavior } = usePageBehavior();

  const handleCoverPhotoChange = (file: File[]) => {
    removeDrawerData();
    if (file.length > 0) {
      setIncomingImage(file);
    }
  };

  const {
    communityName,
    setCommunityName,
    about,
    setAbout,
    categories,
    setCategories,
    setIsPublic,
    isPublic,
    coverImages,
    setCoverImages,
    members,
    setMembers,
  } = useCommunitySetupContext();

  const handlePrivacyChange = (value: string) => {
    setIsPublic(value === 'true');
  };

  const onSubmit = async (data: Parameters<typeof CommunityRepository.createCommunity>[0]) => {
    const community = await CommunityRepository.createCommunity(data);
    if (community) {
      notification.success({
        content: 'Successfully created community.',
      });
      goToCommunityProfilePage(community.data.communityId, 2);
    }
  };

  const validateAndSubmit = async (data: CreateFormValues) => {
    if (!online) {
      notification.info({
        content: 'Failed to create community. Please try again.',
      });
      return;
    }
    try {
      setSubmitting(true);

      if (!data.isPublic && data.userIds?.length === 0) {
        setError('userIds', { message: 'Please select at least one member' });
        return;
      }

      await onSubmit?.({
        ...data,
        avatarFileId: coverImage.length > 0 ? coverImage[coverImage.length - 1].fileId : undefined,
        categoryIds: categories.map((c) => c.categoryId),
        isPublic: isPublic,
        userIds: members && !isPublic ? members.map((m) => m.userId) : undefined,
      });
    } catch (error) {
      notification.info({
        content: 'Failed to create community. Please try again.',
      });
    } finally {
      setSubmitting(false);
      setCoverImages([]);
      setCommunityName('');
      setMembers([]);
      setCategories([]);
      setIsPublic(true);
      setAbout('');
    }
  };

  const disabled = !formState.isValid || submitting || !displayName;

  // to set default value
  useEffect(() => {
    if (communityName && !displayName) {
      setValue('displayName', communityName);
    }
    if (about && !description) {
      setValue('description', about);
    }
    if (categories.length > 0) {
      setCategories(categories);
    }
    if (coverImages.length > 0 && coverImage.length === 0) {
      setCoverImage(coverImages);
    }

    return () => {
      setSubmitting(false);
      setCoverImages([]);
      setCommunityName('');
      setMembers([]);
      setCategories([]);
      setIsPublic(true);
      setAbout('');
    };
  }, []);

  // to update provider value
  useEffect(() => {
    if (displayName && displayName !== communityName) {
      setCommunityName(displayName);
    }
    if (description && description !== about) {
      setAbout(description);
    }
    if (coverImage.length > 0) {
      setCoverImages(coverImage);
    }
    if (description && description !== about) {
      setAbout(description);
    }
    if (isPublic) {
      setMembers([]);
    }
  }, [
    communityName,
    displayName,
    setCommunityName,
    about,
    description,
    setAbout,
    categories,
    setCategories,
    coverImage,
    coverImages,
    setCoverImages,
    isPublic,
  ]);

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.categoryId !== categoryId));
  };

  const handleRemoveUser = (userId: string) => {
    setMembers(members.filter((user) => user.userId !== userId));
  };

  const handleClosePage = () => {
    if (
      communityName ||
      about ||
      categories.length > 0 ||
      coverImage.length > 0 ||
      members.length > 0 ||
      isPublic == false
    ) {
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: 'Leave without finishing?',
        content: 'Your progress won’t be saved and your community won’t be created.',
        onOk: () => {
          setCoverImages([]);
          setCommunityName('');
          setAbout('');
          setCategories([]);
          setMembers([]);
          setIsPublic(true);
          onBack();
          onBack();
        },
        okText: 'Leave',
        cancelText: 'Cancel',
      });
    } else {
      setCoverImages([]);
      setCommunityName('');
      setAbout('');
      setCategories([]);
      setMembers([]);
      setIsPublic(true);
      onBack();
    }
  };

  return (
    <div style={themeStyles} className={styles.createCommunity}>
      <div className={styles.createCommunity__topBar}>
        {isDesktop ? (
          <BackButton pageId={pageId} onPress={handleClosePage} />
        ) : (
          <CloseButton onPress={handleClosePage} />
        )}
        <Title pageId={pageId} titleClassName={styles.createCommunity__title} />
        <div className={styles.createCommunity__emptySpace} />
      </div>
      <form onSubmit={handleSubmit(validateAndSubmit)} className={styles.createCommunity__form}>
        {isDesktop ? (
          <FileTrigger
            allowsMultiple={false}
            acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
            onSelect={(files) => {
              if (!files || files.length === 0) return;
              const fileArray = Array.from(files);
              handleCoverPhotoChange(fileArray);
            }}
          >
            <Button
              type="button"
              value="avatarFileId"
              aria-label="Upload cover image"
              className={styles.createCommunity__coverImageButton}
            >
              <CommunityCoverImage
                files={incomingImage}
                uploadedFiles={coverImage}
                uploadLoading={uploadLoading}
                onLoadingChange={setUploadLoading}
                onChange={({ uploaded, uploading }) => {
                  setCoverImage(uploaded);
                  setIncomingImage(uploading);
                }}
              />
              {coverImage.length > 0 && <div className={styles.createCommunity__overlay} />}
              {!uploadLoading && (
                <IconComponent
                  imgIcon={() => <Camera className={styles.createCommunity__cameraIcon} />}
                  defaultIcon={() => <Camera className={styles.createCommunity__cameraIcon} />}
                />
              )}
            </Button>
          </FileTrigger>
        ) : (
          <Button
            value="avatarFileId"
            type="button"
            className={styles.createCommunity__coverImageButton}
            onPress={() =>
              setDrawerData({
                content: (
                  <>
                    {isMobile() && (
                      <CameraButton
                        pageId={pageId}
                        onImageFileChange={handleCoverPhotoChange}
                        isVisibleVideo={false}
                        isVisibleImage
                      />
                    )}
                    <ImageButton
                      pageId={pageId}
                      onImageFileChange={handleCoverPhotoChange}
                      isSingleUpload
                    />
                  </>
                ),
              })
            }
          >
            <CommunityCoverImage
              files={incomingImage}
              uploadedFiles={coverImage}
              uploadLoading={uploadLoading}
              onLoadingChange={setUploadLoading}
              onChange={({ uploaded, uploading }) => {
                setCoverImage(uploaded);
                setIncomingImage(uploading);
              }}
            />
            {coverImage.length > 0 && <div className={styles.createCommunity__overlay} />}
            {!uploadLoading && (
              <IconComponent
                imgIcon={() => <Camera className={styles.createCommunity__cameraIcon} />}
                defaultIcon={() => <Camera className={styles.createCommunity__cameraIcon} />}
              />
            )}
          </Button>
        )}
        <div className={styles.createCommunity__formContent}>
          <TextField>
            <Label className={styles.createCommunity__label}>
              <CommunityNameTitle pageId={pageId} />
              <Typography.Body className={styles.createCommunity__charactersCount}>
                {displayName.length}/{MAX_LENGTH_COMMUNITY_NAME}
              </Typography.Body>
            </Label>
            <Input
              required
              type="text"
              placeholder="Name your community"
              value={displayName ?? communityName}
              maxLength={MAX_LENGTH_COMMUNITY_NAME}
              className={styles.createCommunity__input}
              {...register('displayName')}
            />
          </TextField>
        </div>
        <div className={styles.createCommunity__formContent}>
          <TextField>
            <Label className={styles.createCommunity__label}>
              <div className={styles.createCommunity__description}>
                <CommunityAboutTitle pageId={pageId} />
                <Typography.Body className={styles.createCommunity__optionalText}>
                  (Optional)
                </Typography.Body>
              </div>
              <Typography.Body className={styles.createCommunity__charactersCount}>
                {description.length}/{MAX_LENGTH_DESC}
              </Typography.Body>
            </Label>
            <TextArea
              rows={1}
              value={description}
              maxLength={MAX_LENGTH_DESC}
              placeholder="Enter description"
              className={styles.createCommunity__textarea}
              {...register('description')}
            />
          </TextField>
        </div>
        <div className={styles.createCommunity__formContent}>
          <label className={styles.createCommunity__label}>
            <CommunityCategoryTitle pageId={pageId} />
          </label>
          <Popover
            trigger={({ isDesktop, isOpen, openPopover }) => {
              const arrowIcon = isDesktop ? (
                isOpen ? (
                  <ChevronTop className={styles.createCommunity__categoryIcon} />
                ) : (
                  <ChevronDown className={styles.createCommunity__categoryIcon} />
                )
              ) : (
                <ChevronRight className={styles.createCommunity__categoryIcon} />
              );
              return categories.length > 0 ? (
                <div className={styles.createCommunity__categories}>
                  <div className={styles.createCommunity__categoriesWrap}>
                    {categories.map((category) => (
                      <div
                        key={category.categoryId}
                        className={styles.createCommunity__selectedCategories}
                      >
                        <Avatar
                          avatarUrl={category.avatar?.fileUrl}
                          imgClassName={styles.createCommunity__selectedCategoryTagAvatar}
                          containerClassName={styles.createCommunity__selectedCategoryTagAvatar}
                          defaultImage={
                            <Category
                              className={styles.createCommunity__selectedCategoryTagAvatarDefault}
                            />
                          }
                        />
                        <Typography.Body className={styles.createCommunity__selectedCategoryName}>
                          {category.name}
                        </Typography.Body>
                        <CloseButton
                          pageId={pageId}
                          onPress={() => handleRemoveCategory(category.categoryId)}
                          defaultClassName={styles.createCommunity__removeCategory}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onPress={() => {
                      isDesktop
                        ? openPopover()
                        : AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                    }}
                  >
                    <IconComponent defaultIcon={() => arrowIcon} imgIcon={() => arrowIcon} />
                  </Button>
                </div>
              ) : (
                <Button
                  className={styles.createCommunity__category}
                  onPress={() => {
                    isDesktop
                      ? openPopover()
                      : AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                  }}
                >
                  <Typography.Body className={styles.createCommunity__selectedCategory}>
                    Select category
                    <IconComponent defaultIcon={() => arrowIcon} imgIcon={() => arrowIcon} />
                  </Typography.Body>
                </Button>
              );
            }}
          >
            <CommunityAddCategoryPage />
          </Popover>
        </div>
        <RadioGroup
          onChange={handlePrivacyChange}
          value={isPublic ? 'true' : 'false'}
          className={styles.createCommunity__formContent}
          labelClassName={styles.createCommunity__label}
          label={<CommunityPrivacyTitle pageId={pageId} />}
          radioProps={{ className: styles.createCommunity__formRadio }}
          radios={[
            {
              value: 'true',
              label: (
                <div className={styles.createCommunity__privacy}>
                  <CommunityPrivacyPublicIcon pageId={pageId} />
                  <div>
                    <CommunityPrivacyPublicTitle pageId={pageId} />
                    <CommunityPrivacyPublicDescription pageId={pageId} />
                  </div>
                </div>
              ),
            },
            {
              value: 'false',
              label: (
                <div className={styles.createCommunity__privacy}>
                  <CommunityPrivacyPrivateIcon pageId={pageId} />
                  <div>
                    <CommunityPrivacyPrivateTitle pageId={pageId} />
                    <CommunityPrivacyPrivateDescription pageId={pageId} />
                  </div>
                </div>
              ),
            },
          ]}
        />
        {!isPublic && (
          <div className={styles.createCommunity__formContent}>
            <div className={styles.createCommunity__formDivider} />
            <label className={styles.createCommunity__label}>
              <CommunityAddMemberTitle pageId={pageId} />
            </label>
            <div className={styles.createCommunity__selectedUserWrap}>
              {members.map((user) => (
                <div key={user.userId} className={styles.createCommunity__selectedUser}>
                  <div className={styles.createCommunity__selectedUserAvatar}>
                    <UserAvatar
                      userId={user.userId}
                      className={styles.createCommunity__selectedUserAvatarImage}
                      imageContainerClassName={styles.createCommunity__selectedUserAvatarImage}
                    />
                    <Button
                      className={styles.createCommunity__removeUserButton}
                      onPress={() => handleRemoveUser(user.userId)}
                    >
                      <Clear className={styles.createCommunity__removeUser} />
                    </Button>
                  </div>
                  <Typography.Body
                    key={user.userId}
                    className={styles.createCommunity__selectedUserDisplayName}
                  >
                    {user.displayName}
                  </Typography.Body>
                </div>
              ))}
              <CommunityAddMemberButton
                pageId={pageId}
                onPress={() => {
                  isDesktop
                    ? openPopup({
                        children: ({ close }) => (
                          <CommunityAddMemberPage closePopup={close} member={members} />
                        ),
                      })
                    : AmityCommunitySetupPageBehavior?.goToAddMemberPage?.({ members });
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.createCommunity__createButton}>
          <CommunityCreateButton pageId={pageId} isDisabled={disabled} />
        </div>
      </form>
    </div>
  );
}
