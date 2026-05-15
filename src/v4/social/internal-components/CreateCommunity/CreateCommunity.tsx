import React, { useEffect, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { Title } from '~/v4/social/elements/Title';
import { BackButton, BrandBadge, CloseButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { Camera } from '~/v4/icons/Camera';
import { Avatar, Typography } from '~/v4/core/components';
import { CommunityCreateButton } from '~/v4/social/elements/CommunityCreateButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { isMobile } from '~/v4/social/utils/isMobile';
import { CommunityCoverImage } from '~/v4/social/internal-components/CommunityCoverImage';
import { CreateFormValues, useCreateCommunity } from '~/v4/social/hooks/useCreateCommunity';
import { CommunityRepository, MembershipAcceptanceTypeEnum } from '@amityco/ts-sdk';
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
import { CommunityInviteMemberTitle } from '~/v4/social/elements/CommunityInviteMemberTitle';
import { CommunityInviteMemberButton } from '~/v4/social/elements/CommunityInviteMemberButton';
import { CommunityInviteMemberDescription } from '~/v4/social/elements/CommunityInviteMemberDescription';
import { CommunityInviteMemberPage } from '~/v4/social/pages/CommunityInviteMemberPage';
import useSocialSettings from '~/v4/social/hooks/useSocialSettings';
import { CommunityPrivacyTitleOption } from '~/v4/social/elements/CommunityPrivacyTitleOption';
import { CommunityPrivacyIcon } from '~/v4/social/elements/CommunityPrivacyIcon';
import Lock from '~/v4/icons/Lock';
import { CommunityPrivacyDescription } from '~/v4/social/elements/CommunityPrivacyDescription';
import WorldWithLock from '~/v4/icons/WorldWithLock';
import World from '~/v4/icons/World';
import { AmityCommunitySetupPrivacy } from '~/v4/social/providers/CommunitySetupProvider';
import { TitleForm } from '~/v4/core/components/TitleForm';
import { Description } from '~/v4/core/components/Description';
import { SubDescription } from '~/v4/core/components/SubDescription';
import { Switch } from '~/v4/core/components/AriaSwitch';

type CreateCommunityProps = {
  mode: AmityCommunitySetupPageMode;
};

type CreateCommunityParams = {
  displayName: string;
  description?: string;
  avatarFileId?: string;
  categoryIds?: string[];
  isPublic: boolean;
  userIds?: string[];
  tags?: string[];
  isDiscoverable?: boolean;
  requiresJoinApproval?: boolean;
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

  const { register, handleSubmit, setError, watch, formState, setValue } = useCreateCommunity();

  const displayName = watch('displayName');
  const description = watch('description');
  const notification = useNotifications();
  const { confirm } = useConfirmContext();
  const { online } = useNetworkState();

  const { AmityCommunitySetupPageBehavior } = usePageBehavior();

  const { socialSettings } = useSocialSettings();

  const isInvitation =
    socialSettings?.membershipAcceptance === MembershipAcceptanceTypeEnum.INVITATION;

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
    setPrivacySettings,
    privacySettings,
    coverImages,
    setCoverImages,
    members,
    setMembers,
    isDiscoverable,
    setIsDiscoverable,
    requiresJoinApproval,
    setRequiresJoinApproval,
  } = useCommunitySetupContext();

  const isPublic = privacySettings === AmityCommunitySetupPrivacy.PUBLIC;

  const handlePrivacyChange = (value: string) => {
    const privacyValue = value as AmityCommunitySetupPrivacy;
    setPrivacySettings(privacyValue);

    switch (privacyValue) {
      case AmityCommunitySetupPrivacy.PUBLIC:
        setIsDiscoverable?.(true);
        setRequiresJoinApproval?.(false);
        break;
      case AmityCommunitySetupPrivacy.PRIVATE_VISIBLE:
        setIsDiscoverable?.(true);
        setRequiresJoinApproval?.(true);
        break;
      case AmityCommunitySetupPrivacy.PRIVATE_HIDDEN:
      default:
        setIsDiscoverable?.(false);
        setRequiresJoinApproval?.(true);
        break;
    }
  };

  const onSubmit = async (data: CreateCommunityParams) => {
    const community = await CommunityRepository.createCommunity({
      ...data,
    });
    if (community) {
      isInvitation &&
        members.length > 0 &&
        community.data.createInvitations(members.map((m) => m.userId));
      notification.success({
        content: resolveString('amity_social_toast_community_setup_create_success'),
      });
      goToCommunityProfilePage(community.data.communityId, 2);
    }
  };

  const validateAndSubmit = async (data: CreateFormValues) => {
    if (!online) {
      notification.info({
        content: resolveString('amity_social_toast_community_setup_toast_create_failed'),
      });
      return;
    }
    try {
      setSubmitting(true);

      if (!data.isPublic && data.userIds?.length === 0) {
        setError('userIds', {
          message: resolveString('amity_social_please_select_at_least_one_member'),
        });
        return;
      }

      await onSubmit?.({
        ...data,
        avatarFileId: coverImage.length > 0 ? coverImage[coverImage.length - 1].fileId : undefined,
        categoryIds: categories.map((c) => c.categoryId),
        isPublic,
        userIds: members && !isPublic && !isInvitation ? members.map((m) => m.userId) : undefined,
        isDiscoverable,
        requiresJoinApproval,
      });
    } catch (error) {
      notification.info({
        content: resolveString('amity_social_toast_community_setup_toast_create_failed'),
      });
    } finally {
      setSubmitting(false);
      setCoverImages([]);
      setCommunityName('');
      setMembers([]);
      setCategories([]);
      setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
      setAbout('');
      setIsDiscoverable(true);
      setRequiresJoinApproval(false);
    }
  };

  const disabled = !formState.isValid || submitting || !displayName;

  // to set default value
  useEffect(() => {
    setRequiresJoinApproval?.(false);
    if (isDesktop) {
      setValue('displayName', '');
      setValue('description', '');
      setIsDiscoverable(true);
      setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
      setCoverImages([]);
      setCategories([]);
    } else {
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
    }
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
      privacySettings !== AmityCommunitySetupPrivacy.PUBLIC
    ) {
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: resolveString('amity_social_modal_event_detail_alert_leave_without_finishing_title'),
        content: resolveString('amity_social_modal_setup_alert_message'),
        onOk: () => {
          setCoverImages([]);
          setCommunityName('');
          setAbout('');
          setCategories([]);
          setMembers([]);
          setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
          onBack();
          onBack();
        },
        okText: resolveString('amity_social_button_leave'),
        cancelText: resolveString('amity_social_button_cancel'),
      });
    } else {
      setCoverImages([]);
      setCommunityName('');
      setAbout('');
      setCategories([]);
      setMembers([]);
      setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
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
        <Title
          pageId={pageId}
          titleClassName={styles.createCommunity__title}
          textKey="amity_social_button_setup_create_button"
        />
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
                        textId="amity_social_button_community_setup_camera_button"
                      />
                    )}
                    <ImageButton
                      pageId={pageId}
                      onImageFileChange={handleCoverPhotoChange}
                      isSingleUpload
                      textId="amity_social_button_community_setup_image_button"
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
              <TitleForm
                pageId={pageId}
                elementId="community_name_title"
                textId="amity_social_label_community_setup_name_title"
              />
              <Typography.Body className={styles.createCommunity__charactersCount}>
                {displayName.length}/{MAX_LENGTH_COMMUNITY_NAME}
              </Typography.Body>
            </Label>
            <Input
              required
              type="text"
              placeholder={useString('amity_social_label_community_setup_name_description')}
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
                <TitleForm
                  pageId={pageId}
                  elementId="community_about_title"
                  textId="amity_social_label_community_setup_about_title"
                />
                <Typography.Body className={styles.createCommunity__optionalText}>
                  {useString('amity_social_label_community_setup_about_optional_title')}
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
              placeholder={useString('amity_social_button_community_setup_about_description')}
              className={styles.createCommunity__textarea}
              {...register('description')}
            />
          </TextField>
        </div>
        <div className={styles.createCommunity__formContent}>
          <label className={styles.createCommunity__label}>
            <div className={styles.createCommunity__description}>
              <TitleForm
                pageId={pageId}
                elementId="community_category_title"
                textId="amity_social_label_community_setup_category_title"
              />
              <Typography.Body className={styles.createCommunity__optionalText}>
                {useString('amity_social_label_community_setup_about_optional_title')}
              </Typography.Body>
            </div>
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
                    data-testid={`${pageId}/*/select-category`}
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
                  data-testid={`${pageId}/*/select-category`}
                  className={styles.createCommunity__category}
                  onPress={() => {
                    isDesktop
                      ? openPopover()
                      : AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                  }}
                >
                  <Typography.Body className={styles.createCommunity__selectedCategory}>
                    {useString('amity_social_button_community_setup_categories_description')}
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
          value={privacySettings}
          className={styles.createCommunity__formContent}
          labelClassName={styles.createCommunity__label}
          label={
            <TitleForm
              pageId={pageId}
              elementId="community_privacy_title"
              textId="amity_social_label_community_setup_privacy_title"
            />
          }
          radioProps={{ className: styles.createCommunity__formRadio }}
          radios={[
            {
              value: AmityCommunitySetupPrivacy.PUBLIC,
              label: (
                <div className={styles.createCommunity__privacy}>
                  <CommunityPrivacyIcon
                    pageId={pageId}
                    elementId="community_privacy_public_icon"
                    defaultIcon={<World className={styles.createCommunity__public__privacyIcon} />}
                  />
                  <div>
                    <CommunityPrivacyTitleOption
                      pageId={pageId}
                      elementId="community_privacy_public_title"
                      textId="amity_social_label_community_setup_privacy_public_title"
                    />
                    <CommunityPrivacyDescription
                      pageId={pageId}
                      elementId="community_privacy_public_description"
                      textId="amity_social_community_setup_page_community_privacy_public_description_text"
                    />
                  </div>
                </div>
              ),
            },
            {
              value: AmityCommunitySetupPrivacy.PRIVATE_VISIBLE,
              label: (
                <div className={styles.createCommunity__privacy}>
                  <CommunityPrivacyIcon
                    pageId={pageId}
                    elementId="community_privacy_private_and_visible_icon"
                    defaultIcon={<WorldWithLock className={styles.createCommunity__privacyIcon} />}
                  />
                  <div>
                    <CommunityPrivacyTitleOption
                      pageId={pageId}
                      elementId="community_privacy_private_and_visible_title"
                      textId="amity_social_label_community_setup_privacy_private_and_visible_title"
                    />
                    <CommunityPrivacyDescription
                      pageId={pageId}
                      elementId="community_privacy_private_and_visible_description"
                      textId="amity_social_label_community_setup_privacy_private_and_visible_description"
                    />
                  </div>
                </div>
              ),
            },
            {
              value: AmityCommunitySetupPrivacy.PRIVATE_HIDDEN,
              label: (
                <div className={styles.createCommunity__privacy}>
                  <CommunityPrivacyIcon
                    pageId={pageId}
                    elementId="community_privacy_private_and_hidden_icon"
                    defaultIcon={<Lock className={styles.createCommunity__privacyIcon} />}
                  />
                  <div>
                    <CommunityPrivacyTitleOption
                      pageId={pageId}
                      elementId="community_privacy_private_and_hidden_title"
                      textId="amity_social_label_community_setup_privacy_private_and_hidden_title"
                    />
                    <CommunityPrivacyDescription
                      pageId={pageId}
                      elementId="community_privacy_private_and_hidden_description"
                      textId="amity_social_label_community_setup_privacy_private_and_hidden_description"
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
        <div className={styles.createCommunity__formDivider} />
        <div className={styles.createCommunity__formContent}>
          <label className={styles.createCommunity__label}>
            <TitleForm
              pageId={pageId}
              elementId="community_membership_title"
              textId="amity_social_label_community_setup_membership_title"
            />
          </label>
          <div className={styles.createCommunity__requireJoinApproval}>
            <div>
              <Description
                pageId={pageId}
                elementId="community_membership_description"
                textId="amity_social_label_community_setup_membership_description"
              />
              <SubDescription
                pageId={pageId}
                elementId="community_membership_sub_description"
                textId="amity_social_label_community_setup_membership_sub_desc"
              />
            </div>
            <Switch
              defaultSelected
              className={styles.createCommunity__switch}
              isSelected={requiresJoinApproval}
              onChange={() => setRequiresJoinApproval(!requiresJoinApproval)}
            />
          </div>
        </div>
        {!isPublic && <div className={styles.createCommunity__formDivider} />}

        {!isPublic && !isInvitation && (
          <div className={styles.createCommunity__formContent}>
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
                      textPlaceholderClassName={styles.createCommunity__selectedUserAvatarImage}
                    />
                    <Button
                      className={styles.createCommunity__removeUserButton}
                      onPress={() => handleRemoveUser(user.userId)}
                    >
                      <Clear className={styles.createCommunity__removeUser} />
                    </Button>
                  </div>
                  <div className={styles.createCommunity__selectedUserDisplayNameWrapper}>
                    <Typography.Body
                      key={user.userId}
                      className={styles.createCommunity__selectedUserDisplayName}
                    >
                      {user.displayName}
                    </Typography.Body>
                    {user.isBrand && (
                      <div className={styles.createCommunity__brandBadge}>
                        <BrandBadge />
                      </div>
                    )}
                  </div>
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
        {!isPublic && isInvitation && (
          <>
            <div className={styles.createCommunity__formDivider} />
            <div className={styles.createCommunity__formContent}>
              <label className={styles.createCommunity__inviteMemberLabel}>
                <CommunityInviteMemberTitle pageId={pageId} />
                <CommunityInviteMemberDescription pageId={pageId} />
              </label>
              <div className={styles.createCommunity__selectedUserWrap}>
                <CommunityInviteMemberButton
                  pageId={pageId}
                  onPress={() => {
                    isDesktop
                      ? openPopup({
                          id: 'community_invite_member_page',
                          children: <CommunityInviteMemberPage />,
                        })
                      : AmityCommunitySetupPageBehavior?.goToInviteMemberPage?.({});
                  }}
                />
                {members.map((user) => (
                  <div key={user.userId} className={styles.createCommunity__selectedUser}>
                    <div className={styles.createCommunity__selectedUserAvatar}>
                      <UserAvatar
                        userId={user.userId}
                        className={styles.createCommunity__selectedUserAvatarImage}
                        imageContainerClassName={styles.createCommunity__selectedUserAvatarImage}
                        textPlaceholderClassName={styles.createCommunity__selectedUserAvatarImage}
                      />
                      <Button
                        className={styles.createCommunity__removeUserButton}
                        onPress={() => handleRemoveUser(user.userId)}
                      >
                        <Clear className={styles.createCommunity__removeUser} />
                      </Button>
                    </div>
                    <div className={styles.createCommunity__selectedUserDisplayNameWrapper}>
                      <Typography.Body
                        key={user.userId}
                        className={styles.createCommunity__selectedUserDisplayName}
                      >
                        {user.displayName}
                      </Typography.Body>
                      {user.isBrand && (
                        <div className={styles.createCommunity__brandBadge}>
                          <BrandBadge />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.createCommunity__createButton}>
          <CommunityCreateButton pageId={pageId} isDisabled={disabled} />
        </div>
      </form>
    </div>
  );
}
