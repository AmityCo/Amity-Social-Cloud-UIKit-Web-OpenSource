import React, { useEffect, useState } from 'react';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton, CloseButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { Camera } from '~/v4/icons/Camera';
import { Avatar, Typography } from '~/v4/core/components';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { isMobile } from '~/v4/social/utils/isMobile';
import { CommunityCoverImage } from '~/v4/social/internal-components/CommunityCoverImage';
import { EditFormValues, useEditCommunity } from '~/v4/social/hooks/useCreateCommunity';
import { FileTrigger, Input, Label, TextArea, TextField } from 'react-aria-components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityEditTitle } from '~/v4/social/elements/CommunityEditTitle';
import { CommunityEditButton } from '~/v4/social/elements/CommunityEditButton/CommunityEditButton';
import useCategoriesByIds from '~/v4/social/hooks/useCategoriesByIds';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { Category } from '~/v4/icons/Category';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ChevronTop } from '~/v4/icons/ChevronTop';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import ChevronRight from '~/v4/icons/ChevronRight';
import { CommunityAddCategoryPage } from '~/v4/social/pages';
import styles from './EditCommunity.module.css';
import { Popover } from '~/v4/core/components/AriaPopover';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import { useNetworkState } from 'react-use';
import { AmityCommunitySetupPrivacy } from '~/v4/social/providers/CommunitySetupProvider';
import { CommunityPrivacyIcon } from '~/v4/social/elements/CommunityPrivacyIcon';
import { CommunityPrivacyTitleOption } from '~/v4/social/elements/CommunityPrivacyTitleOption';
import World from '~/v4/icons/World';
import { CommunityPrivacyDescription } from '~/v4/social/elements/CommunityPrivacyDescription';
import WorldWithLock from '~/v4/icons/WorldWithLock';
import Lock from '~/v4/icons/Lock';
import { TitleForm } from '~/v4/core/components/TitleForm';
import { Description } from '~/v4/core/components/Description';
import { SubDescription } from '~/v4/core/components/SubDescription';
import { Switch } from '~/v4/core/components/AriaSwitch';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import useJoinRequestsCollection from '~/v4/social/hooks/collections/useJoinRequestsCollection';

type EditCommunityProps = {
  community: Amity.Community;
  mode: AmityCommunitySetupPageMode;
};

type UpdateCommunityParams = {
  displayName: string;
  avatarFileId?: string;
  categoryIds?: string[];
  isPublic: boolean;
  description?: string;
  tags?: string[];
  isDiscoverable?: boolean;
  requiresJoinApproval?: boolean;
};

export const EditCommunity = ({ mode, community }: EditCommunityProps) => {
  const MAX_LENGTH_DESC = 180;
  const MAX_LENGTH_COMMUNITY_NAME = 30;
  const pageId = 'community_setup_page';

  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { online } = useNetworkState();
  const { confirm, info } = useConfirmContext();
  const { themeStyles } = useAmityPage({ pageId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { onBack, goToCommunityProfilePage } = useNavigation();
  const { AmityCommunitySetupPageBehavior } = usePageBehavior();
  const communityCategories = useCategoriesByIds(community.categoryIds);
  const { register, handleSubmit, setError, watch, formState, setValue, getValues, control } =
    useEditCommunity(community as Amity.Community);

  const [submitting, setSubmitting] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [incomingImage, setIncomingImage] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<Amity.File[]>([]);

  const {
    about,
    privacySettings,
    setAbout,
    categories,
    setPrivacySettings,
    setCategories,
    communityName,
    setCoverImages,
    setCommunityName,
    requiresJoinApproval,
    setRequiresJoinApproval,
    isDiscoverable,
    setIsDiscoverable,
  } = useCommunitySetupContext();

  const { joinRequests } = useJoinRequestsCollection({ community });

  const hasPendingJoinRequests = joinRequests && joinRequests.length > 0;

  const { globalFeaturedPostsItems } = useGlobalFeedContext();

  const hasGlobalFeaturedPostsInCommunity = globalFeaturedPostsItems.some(
    (post) => post.post?.targetId === community.communityId,
  );

  const isPublic = privacySettings === AmityCommunitySetupPrivacy.PUBLIC;

  const displayName = watch('displayName');
  const description = watch('description');

  // to update provider value
  useEffect(() => {
    if (communityName == '' || displayName !== community.displayName) {
      setCommunityName(displayName);
    }
    if (about == '' || description !== community.description) {
      setAbout(description ?? '');
    }
    if (categories.length == 0 && communityCategories.length > 0) {
      setCategories(communityCategories);
    }
    if (requiresJoinApproval !== community.requiresJoinApproval) {
      setRequiresJoinApproval(community.requiresJoinApproval ?? false);
    }
    if (!community.isPublic) {
      setPrivacySettings(
        community?.isDiscoverable
          ? AmityCommunitySetupPrivacy.PRIVATE_VISIBLE
          : AmityCommunitySetupPrivacy.PRIVATE_HIDDEN,
      );
    }
    if (community.isPublic) {
      setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
    }
    if (isDiscoverable !== community.isDiscoverable) {
      setIsDiscoverable(community.isDiscoverable ?? true);
    }
  }, [displayName, description, communityCategories, coverImage]);

  const handleCoverPhotoChange = (file: File[]) => {
    removeDrawerData();
    if (file.length > 0) setIncomingImage(file);
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacySettings(value as AmityCommunitySetupPrivacy);
    if (
      value === AmityCommunitySetupPrivacy.PUBLIC ||
      value === AmityCommunitySetupPrivacy.PRIVATE_VISIBLE
    ) {
      setIsDiscoverable?.(true);
    } else {
      setIsDiscoverable?.(false);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.categoryId !== categoryId));
  };

  const handleClosePage = () => {
    const hasChanges =
      communityName !== community?.displayName ||
      about !== (community?.description ?? '') ||
      coverImage.length > 0 ||
      categories.length !== communityCategories.length ||
      ![...categories]
        .sort()
        .every((value, index) => value === [...communityCategories].sort()[index]) ||
      community.isPublic !== isPublic ||
      requiresJoinApproval !== (community?.requiresJoinApproval ?? false) ||
      isDiscoverable !== (community.isDiscoverable ?? true);

    if (hasChanges) {
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
          setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
          setIsDiscoverable(true);
          setRequiresJoinApproval(false);
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
      setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
      setIsDiscoverable(true);
      setRequiresJoinApproval(false);
      onBack();
    }
  };

  const onSubmit = async (data: UpdateCommunityParams) => {
    const communities = await CommunityRepository.updateCommunity(community.communityId, data);
    if (!communities) return null;
    if (communities) {
      notification.success({
        content: 'Successfully updated community profile.',
      });
      goToCommunityProfilePage(community.communityId);
    }
  };

  const submitCommunityUpdate = async (data: EditFormValues) => {
    await onSubmit({
      ...data,
      displayName: communityName,
      avatarFileId: coverImage.length > 0 ? coverImage[coverImage.length - 1].fileId : undefined,
      categoryIds: categories.length > 0 ? categories.map((c) => c.categoryId) : [],
      isPublic,
      isDiscoverable,
      requiresJoinApproval,
    });
  };

  const resetFormState = () => {
    setCoverImages([]);
    setCommunityName('');
    setCategories([]);
    setPrivacySettings(AmityCommunitySetupPrivacy.PUBLIC);
    setAbout('');
  };

  const handleSubmitError = (error: any) => {
    notification.info({
      content: 'Failed to update community. Please try again.',
    });
    setRequiresJoinApproval(community.requiresJoinApproval ?? false);
  };

  const performCommunityUpdate = async (data: EditFormValues) => {
    try {
      setSubmitting(true);
      await submitCommunityUpdate(data);
      resetFormState();
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const validateAndSubmit = async (data: EditFormValues) => {
    if (!online) {
      notification.info({
        content: 'Failed to save your community profile. Please try again.',
      });
      return;
    }

    setSubmitting(true);

    // Check for pending join requests
    if (community.requiresJoinApproval && !requiresJoinApproval && hasPendingJoinRequests) {
      setSubmitting(false);
      info({
        pageId: pageId,
        title: 'You have pending join requests',
        content: 'Please address these requests before switching off membership approval.',
      });
      return;
    }

    // Check for global featured posts
    if (
      community.isPublic &&
      privacySettings !== AmityCommunitySetupPrivacy.PUBLIC &&
      hasGlobalFeaturedPostsInCommunity
    ) {
      setSubmitting(false);
      confirm({
        pageId: pageId,
        title: 'Change community privacy settings?',
        content: `This community has globally featured posts. Changing the community from public to ${AmityCommunitySetupPrivacy.PRIVATE_VISIBLE ? 'private & visible' : 'private & hidden'} will remove these posts from being featured globally.`,
        okText: 'Confirm',
        onOk: () => performCommunityUpdate(data),
      });
      return;
    }

    // No early returns, proceed with the update
    await performCommunityUpdate(data);
  };

  const disabled =
    submitting ||
    uploadLoading ||
    !communityName ||
    (communityName === community?.displayName &&
      about === community?.description &&
      coverImage.length === 0 &&
      categories.length === communityCategories.length &&
      categories.sort().every((value, index) => value === communityCategories.sort()[index]) &&
      community.isPublic === isPublic &&
      requiresJoinApproval === community?.requiresJoinApproval &&
      !isPublic === !community.isPublic &&
      isDiscoverable === community.isDiscoverable);

  return (
    <div style={themeStyles} className={styles.editCommunity}>
      <div className={styles.editCommunity__topBar}>
        {isDesktop ? (
          <BackButton pageId={pageId} onPress={handleClosePage} />
        ) : (
          <CloseButton onPress={handleClosePage} />
        )}
        <CommunityEditTitle pageId={pageId} className={styles.editCommunity__title} />
        <div className={styles.editCommunity__emptySpace} />
      </div>
      <form onSubmit={handleSubmit(validateAndSubmit)} className={styles.editCommunity__form}>
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
              className={styles.editCommunity__coverImageButton}
              data-no-image={coverImage.length == 0 || community?.avatarFileId}
            >
              <CommunityCoverImage
                files={incomingImage}
                uploadedFiles={coverImage}
                uploadLoading={uploadLoading}
                onLoadingChange={setUploadLoading}
                avatarFileId={community?.avatarFileId}
                onChange={({ uploaded, uploading }) => {
                  setCoverImage(uploaded);
                  setIncomingImage(uploading);
                }}
              />
              {coverImage.length > 0 ||
                (community?.avatarFileId && <div className={styles.editCommunity__overlay} />)}
              {!uploadLoading && (
                <IconComponent
                  imgIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                  defaultIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                />
              )}
            </Button>
          </FileTrigger>
        ) : (
          <Button
            type="button"
            value="avatarFileId"
            className={styles.editCommunity__coverImageButton}
            data-no-image={coverImage.length == 0 || community?.avatarFileId}
            onPress={() =>
              setDrawerData({
                content: (
                  <>
                    {isMobile() && (
                      <CameraButton
                        isVisibleImage
                        pageId={pageId}
                        isVisibleVideo={false}
                        onImageFileChange={handleCoverPhotoChange}
                      />
                    )}
                    <ImageButton
                      isSingleUpload
                      pageId={pageId}
                      onImageFileChange={handleCoverPhotoChange}
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
              avatarFileId={community?.avatarFileId}
              onChange={({ uploaded, uploading }) => {
                setCoverImage(uploaded);
                setIncomingImage(uploading);
              }}
            />
            {coverImage.length > 0 ||
              (community?.avatarFileId && <div className={styles.editCommunity__overlay} />)}
            {!uploadLoading && (
              <IconComponent
                imgIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                defaultIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
              />
            )}
          </Button>
        )}
        <div className={styles.editCommunity__formContent}>
          <TextField>
            <Label className={styles.editCommunity__label}>
              <TitleForm pageId={pageId} elementId="community_name_title" />
              <Typography.Body className={styles.editCommunity__charactersCount}>
                {displayName.length}/{MAX_LENGTH_COMMUNITY_NAME}
              </Typography.Body>
            </Label>
            <Input
              required
              type="text"
              aria-label="displayName"
              placeholder="Name your community"
              value={displayName ?? communityName}
              maxLength={MAX_LENGTH_COMMUNITY_NAME}
              className={styles.editCommunity__input}
              {...register('displayName')}
            />
          </TextField>
        </div>
        <div className={styles.editCommunity__formContent}>
          <TextField>
            <Label className={styles.editCommunity__label}>
              <div className={styles.editCommunity__description}>
                <TitleForm pageId={pageId} elementId="community_about_title" />
                <Typography.Body className={styles.editCommunity__optionalText}>
                  (Optional)
                </Typography.Body>
              </div>
              <Typography.Body className={styles.editCommunity__charactersCount}>
                {description?.length}/{MAX_LENGTH_DESC}
              </Typography.Body>
            </Label>
            <TextArea
              value={description}
              maxLength={MAX_LENGTH_DESC}
              placeholder="Enter description"
              className={styles.editCommunity__textarea}
              {...register('description')}
            />
          </TextField>
        </div>
        <div className={styles.editCommunity__formContent}>
          <label className={styles.editCommunity__label}>
            <div className={styles.editCommunity__description}>
              <TitleForm pageId={pageId} elementId="community_category_title" />
              <Typography.Body className={styles.editCommunity__optionalText}>
                (Optional)
              </Typography.Body>
            </div>
          </label>
          <Popover
            trigger={({ isDesktop, isOpen, openPopover }) => {
              const arrowIcon = isDesktop ? (
                isOpen ? (
                  <ChevronTop className={styles.editCommunity__categoryIcon} />
                ) : (
                  <ChevronDown className={styles.editCommunity__categoryIcon} />
                )
              ) : (
                <ChevronRight className={styles.editCommunity__categoryIcon} />
              );
              return categories.length > 0 ? (
                <div className={styles.editCommunity__categories}>
                  <div className={styles.editCommunity__categoriesWrap}>
                    {categories.map((category) => (
                      <div
                        key={category.categoryId}
                        className={styles.editCommunity__selectedCategories}
                      >
                        <div className={styles.editCommunity__selectedCategoryTagAvatar}>
                          <Avatar
                            avatarUrl={category.avatar?.fileUrl}
                            imgClassName={styles.editCommunity__selectedCategoryTagAvatarDefault}
                            containerClassName={
                              styles.editCommunity__selectedCategoryTagAvatarDefault
                            }
                            defaultImage={
                              <Category
                                className={styles.editCommunity__selectedCategoryTagAvatarDefault}
                              />
                            }
                          />
                        </div>
                        <Typography.Body className={styles.editCommunity__selectedCategoryName}>
                          {category.name}
                        </Typography.Body>
                        <CloseButton
                          pageId={pageId}
                          defaultClassName={styles.editCommunity__removeCategory}
                          onPress={() => handleRemoveCategory(category.categoryId)}
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
                  className={styles.editCommunity__category}
                  onPress={() => {
                    isDesktop
                      ? openPopover()
                      : AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                  }}
                >
                  <Typography.Body className={styles.editCommunity__selectedCategory}>
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
          value={privacySettings}
          labelClassName={styles.editCommunity__label}
          className={styles.editCommunity__formContent}
          label={<TitleForm pageId={pageId} elementId="community_privacy_title" />}
          radioProps={{ className: styles.editCommunity__formRadio }}
          radios={[
            {
              value: AmityCommunitySetupPrivacy.PUBLIC,
              label: (
                <div className={styles.editCommunity__privacy}>
                  <CommunityPrivacyIcon
                    pageId={pageId}
                    elementId="community_privacy_public_icon"
                    defaultIcon={<World className={styles.editCommunity__public__privacyIcon} />}
                  />
                  <div>
                    <CommunityPrivacyTitleOption
                      pageId={pageId}
                      elementId="community_privacy_public_title"
                    />
                    <CommunityPrivacyDescription
                      pageId={pageId}
                      elementId="community_privacy_public_description"
                    />
                  </div>
                </div>
              ),
            },
            {
              value: AmityCommunitySetupPrivacy.PRIVATE_VISIBLE,
              label: (
                <div className={styles.editCommunity__privacy}>
                  <CommunityPrivacyIcon
                    pageId={pageId}
                    elementId="community_privacy_private_and_hidden_icon"
                    defaultIcon={<WorldWithLock className={styles.editCommunity__privacyIcon} />}
                  />
                  <div>
                    <CommunityPrivacyTitleOption
                      pageId={pageId}
                      elementId="community_privacy_private_and_visible_title"
                    />
                    <CommunityPrivacyDescription
                      pageId={pageId}
                      elementId="community_privacy_private_and_visible_description"
                    />
                  </div>
                </div>
              ),
            },
            {
              value: AmityCommunitySetupPrivacy.PRIVATE_HIDDEN,
              label: (
                <div className={styles.editCommunity__privacy}>
                  <CommunityPrivacyIcon
                    pageId={pageId}
                    elementId="community_privacy_private_and_hidden_icon"
                    defaultIcon={<Lock className={styles.editCommunity__privacyIcon} />}
                  />
                  <div>
                    <CommunityPrivacyTitleOption
                      pageId={pageId}
                      elementId="community_privacy_private_and_hidden_title"
                    />
                    <CommunityPrivacyDescription
                      pageId={pageId}
                      elementId="community_privacy_private_and_hidden_description"
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />

        <div className={styles.editCommunity__formDivider} />
        <div className={styles.editCommunity__formContent}>
          <label className={styles.editCommunity__label}>
            <TitleForm pageId={pageId} elementId="community_membership_title" />
          </label>
          <div className={styles.editCommunity__requireJoinApproval}>
            <div>
              <Description pageId={pageId} elementId="community_membership_description" />
              <SubDescription pageId={pageId} elementId="community_membership_sub_description" />
            </div>
            <Switch
              isSelected={requiresJoinApproval}
              onChange={() => setRequiresJoinApproval(!requiresJoinApproval)}
              className={styles.editCommunity__switch}
            />
          </div>
        </div>

        <div className={styles.editCommunity__createButton}>
          <CommunityEditButton pageId={pageId} isDisabled={disabled} />
        </div>
      </form>
    </div>
  );
};
