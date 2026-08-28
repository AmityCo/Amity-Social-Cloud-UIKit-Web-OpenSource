import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import styles from './PollPostComposerPage.module.css';
import { FileTrigger, Form, Input, Label, TextArea, TextField } from 'react-aria-components';
import { Button as AriaButton } from '~/v4/core/components/AriaButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { PollQuestionTitle } from '~/v4/social/elements/PollQuestionTitle/PollQuestionTitle';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { Typography } from '~/v4/core/components';
import { PollOptionsTitle } from '~/v4/social/elements/PollOptionsTitle';
import { PollOptionsDesc } from '~/v4/social/elements/PollOptionsDesc';
import { TrashIcon } from '~/v4/icons/Trash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CommunityPostSettings, PollRepository, PostRepository, FileType } from '@amityco/ts-sdk';
import { PollAddOptionButton } from '~/v4/social/elements/PollAddOptionButton/PollAddOptionButton';
import { PollMultipleSelectionTitle } from '~/v4/social/elements/PollMultipleSelectionTitle';
import { PollMultipleSelectionDesc } from '~/v4/social/elements/PollMultipleSelectionDesc';
import { PollDurationTitle } from '~/v4/social/elements/PollDurationTitle';
import { PollDurationDesc } from '~/v4/social/elements/PollDurationDesc/PollDurationDesc';
import { PollDurationOptions } from '~/v4/social/internal-components/PollDurationOptions';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Button } from '~/v4/core/natives/Button';
import { AngleDown as DropdownIcon } from '~/v4/icons/AngleDown';
import { CalendarDate, getLocalTimeZone, now, Time } from '@internationalized/date';
import { formatTime } from '~/v4/social/utils/formatTime';
import { formatToDayMonth } from '~/v4/social/utils/formatToDayMonth';
import { calculateMilliseconds } from '~/v4/social/utils/calculateMilliseconds';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import {
  MAX_POST_TITLE_LENGTH,
  MAXIMUM_POST_CHARACTERS,
  MAX_OPTIONS,
  MAX_OPTION_LENGTH,
  MAX_POLL_QUESTION_LENGTH,
  MILLISECONDS_IN_DAY,
} from '~/v4/social/constants';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { Notification } from '~/v4/core/components/Notification';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Popover } from '~/v4/core/components/AriaPopover';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { Switch } from '~/v4/core/components/AriaSwitch';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { isAdmin } from '~/v4/utils/permissions';
import { useNetworkState } from 'react-use';
import { TextArea as $TextArea } from '~/v4/core/components/TextField';
import { FormLabel } from '~/v4/social/elements/FormLabel';
import { COMPONENT_ID, ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';
import { UploadImageArea } from './UploadImageArea';
import CloseCircle from '~/v4/icons/CloseCircle';
import { Plus } from '~/v4/icons/Plus';
import { useFilePostUpload } from '~/v4/social/hooks/useFilePostUpload';
import { ImageThumbnail } from '~/v4/social/internal-components/ImageThumbnail';

type PollPostComposerPageProps = {
  targetId: string | null;
  targetType: 'community' | 'user';
  pollType?: 'text' | 'image';
};

type FormValues = Parameters<typeof PollRepository.createPoll>[0];
type ImageOption = {
  dataType: 'image';
  data: string;
  fileId: string;
  id: string;
  indexOfFiles: number | undefined;
};

export type CreatePollPostParams = {
  pollId: string;
  text: string;
  mentioned: Mentioned[];
  mentionees: Mentionees;
  hashtags: Amity.Hashtag[];
  links?: Amity.Link[];
};

export const PollPostComposerPage = ({
  targetId,
  targetType,
  pollType,
}: PollPostComposerPageProps) => {
  const pageId = 'poll_post_composer_page';

  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { onBack, prevPage } = useNavigation();

  const timeDuration = [
    { value: 1, label: useString('amity_social_button_poll_duration_1_day') },
    { value: 3, label: useString('amity_social_button_poll_duration_3_days') },
    { value: 7, label: useString('amity_social_button_poll_duration_7_days') },
    { value: 14, label: useString('amity_social_button_poll_duration_14_days') },
    { value: 30, label: useString('amity_social_button_poll_duration_30_days') },
  ];
  const { community } = useCommunity({ communityId: targetId });
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const notification = useNotifications();
  const { online } = useNetworkState();
  const { closePopup } = usePopupContext();
  const { confirm, info } = useConfirmContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const mentionRef = useRef<HTMLDivElement | null>(null);
  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  const {
    files,
    progress,
    removeFile,
    handleFileChange,
    isLoading,
    handleAltTextChange,
    retryUpload,
  } = useFilePostUpload(pageId);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const timeNow = now(getLocalTimeZone());
  const { isDesktop } = useResponsive();

  const [isCreating, setIsCreating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [options, setOptions] = useState([
    { dataType: 'text', data: '' },
    { dataType: 'text', data: '' },
  ]);
  const [imageOptions, setImageOptions] = useState<ImageOption[]>([
    { dataType: 'image', data: '', fileId: '', id: '', indexOfFiles: undefined },
    { dataType: 'image', data: '', fileId: '', id: '', indexOfFiles: undefined },
  ]);
  const [isMultiple, setIsMultiple] = useState(false);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<{ value: number; label: string } | undefined>(
    timeDuration[4],
  );

  const [selectedDate, setSelectedDate] = useState<CalendarDate | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Time | undefined>(undefined);
  const [currentUploadImageIndex, setCurrentUploadImageIndex] = useState<number | undefined>(
    undefined,
  );

  const [textValue, setTextValue] = useState<CreatePollPostParams>({
    pollId: '',
    text: '',
    mentioned: [],
    hashtags: [],
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
    links: [],
  });

  const answerType = isMultiple ? 'multiple' : 'single';

  const formatEndTime = selectedTime
    ? formatTime(selectedTime)
    : formatTime(new Time(timeNow.hour, timeNow.minute));

  const formatEndDate =
    selectedDate &&
    new Intl.DateTimeFormat(typeof navigator !== 'undefined' ? navigator.language : 'en', {
      day: 'numeric',
      month: 'short',
    }).format(selectedDate.toDate(getLocalTimeZone()));

  //Calculate end date when select radio value
  const futureDate = new Date();
  duration && futureDate.setDate(futureDate.getDate() + duration.value);
  const formattedDate = formatToDayMonth(futureDate);

  // Calculate the milliseconds for date and time picker
  const milliseconds = calculateMilliseconds(selectedDate, selectedTime);

  const isDirty =
    title.trim() !== '' ||
    textValue.text.length > 0 ||
    options.some((option) => option.data.length > 0 || option.data.trim() !== '') ||
    isMultiple ||
    duration?.value !== timeDuration[4].value ||
    selectedDate;

  const closedIn = duration && !milliseconds ? duration.value * MILLISECONDS_IN_DAY : milliseconds;

  const defaultValues: FormValues = {
    question: '',
    answers: [],
    answerType: 'single',
    closedIn: 0,
  };

  const { handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  async function createPost(createPostParams: Parameters<typeof PostRepository.createPost>[0]) {
    try {
      setIsCreating(true);

      const postData = await PostRepository.createPost(createPostParams);

      const post = postData.data;

      const isModerator =
        (moderators || []).find((moderator) => moderator.userId === post.postedUserId) != null;

      if (
        ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
          .needApprovalOnPostCreation ||
          community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) &&
        !isModerator &&
        !isAdmin(user?.roles)
      ) {
        info({
          pageId,
          title: resolveString('amity_social_button_post_composer_create_buttons_sent_for_review'),
          content: resolveString('amity_social_modal_dialog_post_pending_approval'),
          okText: resolveString('amity_social_button_ok'),
        });
      }
    } catch (error: unknown) {
      setIsCreating(false);
      setIsError(true);
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
        notification.info({
          content: resolveString('amity_social_error_post_create_ban_word_error'),
          alignment: 'fullscreen',
        });
      }
    } finally {
      setIsCreating(false);
      if (isDesktop) closePopup();
      else {
        prevPage?.type === PageTypes.PollTargetSelectionPage ? onBack(2) : onBack();
      }
    }
  }

  async function onCreatePost(pollId: string) {
    const data: { text?: string } = {};

    if (data.text?.length && data.text.length > MAXIMUM_POST_CHARACTERS) {
      info({
        pageId,
        title: resolveString('amity_social_unable_to_post'),
        content: resolveString('amity_social_error_post_text_exceed_error_message'),
        okText: resolveString('amity_social_button_done'),
      });
      return;
    }

    const createPostParams: Parameters<typeof PostRepository.createPost>[0] = {
      targetId: targetId!,
      targetType: targetType,
      data: { pollId, text: textValue.text, title: title?.trim() },
      dataType: 'poll',
      metadata: {
        mentioned: textValue.mentioned,
        hashtags: textValue.hashtags,
      },
      mentionees: textValue.mentionees as Amity.UserMention[],
      hashtags: textValue.hashtags.map((hashtag) => hashtag.text),
      attachments: [],
      links: textValue.links || [],
    };

    return createPost(createPostParams);
  }

  const validateAndSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!online) {
      notification.info({
        content: resolveString('amity_social_toast_post_create_generic_error_message'),
        alignment: 'fixed',
      });
      return;
    }
    try {
      setIsCreating(true);

      const payload = {
        question: textValue.text,
        answers:
          pollType === 'image'
            ? imageOptions
                .filter((option) => option.fileId)
                .map(({ id, indexOfFiles, ...option }) => option)
            : options.filter((option) => option.data.trim().length > 0),
        answerType,
        closedIn,
        title: title?.trim(),
      };

      const createdPoll = await PollRepository.createPoll(
        payload as Parameters<typeof PollRepository.createPoll>[0],
      );
      await onCreatePost(createdPoll.data.pollId);
      setIsCreating(false);
      isDesktop && closePopup();
    } catch (error: unknown) {
      setIsCreating(false);
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
        notification.info({
          content: resolveString('amity_social_error_post_create_ban_word_error'),
          alignment: 'fullscreen',
        });
      }
    }
  };

  const onClickClose = () => {
    if (!isDirty)
      return prevPage?.type == PageTypes.PollTargetSelectionPage ? onBack(-2) : onBack();
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: resolveString('amity_social_modal_dialog_title_discard_post'),
      content: resolveString('amity_social_modal_dialog_discard_post'),
      onOk: () => {
        prevPage?.type == PageTypes.PollTargetSelectionPage ? onBack(-2) : onBack();
      },
      okText: resolveString('amity_social_button_discard'),
      cancelText: resolveString('amity_social_button_keep_editing'),
    });
  };

  const onChange = (val: {
    mentioned: Mentioned[];
    mentionees: Mentionees;
    hashtags: Amity.Hashtag[];
    text: string;
    links?: Amity.Link[];
  }) =>
    setTextValue((prev) => ({
      ...prev,
      mentioned: val.mentioned,
      text: val.text,
      mentionees: val.mentionees,
      hashtags: val.hashtags,
      links: val.links || [],
    }));

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, { dataType: 'text', data: '' }]);
    }
  };
  const addImageOption = () => {
    if (imageOptions.length < MAX_OPTIONS) {
      setImageOptions([
        ...imageOptions,
        { dataType: 'image', data: '', fileId: '', id: '', indexOfFiles: undefined },
      ]);
    }
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, data: value } : option,
    );
    setOptions(updatedOptions);
  };

  const updateImageOption = (index: number, value: string) => {
    const updatedImageOptions = imageOptions.map((option, i) => {
      const trimValue =
        value.length > MAX_OPTION_LENGTH ? value.slice(0, MAX_OPTION_LENGTH) : value;
      return i === index ? { ...option, data: trimValue } : option;
    });
    setImageOptions(updatedImageOptions);
  };

  const deleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };
  const deleteImageOption = (index: number) => {
    const updatedImageOptions = imageOptions.filter((_, i) => i !== index);
    if (updatedImageOptions.length < 2) {
      addImageOption();
    }
    setImageOptions(updatedImageOptions);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleToggleChange = () => setIsMultiple(!isMultiple);

  const onDurationChange = (selectedDuration: { value: number; label: string } | undefined) =>
    setDuration(selectedDuration);

  const onChangeDate = (date: CalendarDate | undefined) => setSelectedDate(date);

  const onChangeTime = (time: Time | undefined) => setSelectedTime(time);

  const isDisabledSubmitButton =
    isCreating ||
    textValue.text.trim() === '' ||
    textValue.text.length > MAX_POLL_QUESTION_LENGTH ||
    options.length < 2 ||
    options.filter((option) => option.data.trim().length > 0).length < 2 ||
    options.some((option) => option.data.length > MAX_OPTION_LENGTH);

  const isDisabledImagePollSubmitButton =
    isCreating ||
    textValue.text.trim() === '' ||
    textValue.text.length > MAX_POLL_QUESTION_LENGTH ||
    imageOptions.length < 2 ||
    imageOptions.filter((option) => !!option.fileId).length < 2 ||
    imageOptions.some((option) => option.data.length > MAX_OPTION_LENGTH);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setCurrentUploadImageIndex(index);
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange([e.target.files[0]], FileType.IMAGE);
    }
  };
  const triggerFileInput = (index: number) => {
    const fileInput = document.getElementById(`upload-${index}`) as HTMLInputElement;
    fileInput.click();
  };

  useEffect(() => {
    const currentImageOptions = [...imageOptions];
    if (
      files?.length > 0 &&
      files[files.length - 1]?.id &&
      typeof currentUploadImageIndex === 'number'
    ) {
      currentImageOptions[currentUploadImageIndex].id = files[files.length - 1]?.id;
      currentImageOptions[currentUploadImageIndex].indexOfFiles = files.length - 1;
    }
    if (
      files?.length > 0 &&
      (files[files.length - 1]?.file as Amity.File).fileId &&
      typeof currentUploadImageIndex === 'number'
    ) {
      currentImageOptions[currentUploadImageIndex].fileId = (
        files[files.length - 1]?.file as Amity.File
      ).fileId;
      setImageOptions(currentImageOptions);
    }
  }, [progress, files]);

  const errorImageMenu = useCallback(
    ({
      fileIndex,
      closeMenu,
      fileId,
    }: {
      fileIndex: number;
      closeMenu: () => void;
      fileId: string;
    }) => {
      return (
        <div className={styles.pollPostComposer__errorImageOption__container}>
          <Button
            className={styles.pollPostComposer__errorImageOption__item}
            onPress={() => {
              closeMenu();
              if (fileId) {
                retryUpload(fileId);
              }
            }}
          >
            <Typography.Body className={styles.pollPostComposer__errorImageOption__text}>
              {useString('amity_social_button_retry')}
            </Typography.Body>
          </Button>
          <Button
            className={styles.pollPostComposer__errorImageOption__item}
            onPress={() => {
              closeMenu();
              triggerFileInput(fileIndex);
            }}
          >
            <Typography.Body className={styles.pollPostComposer__errorImageOption__text}>
              {useString('amity_social_label_upload_new_image')}
            </Typography.Body>
          </Button>
        </div>
      );
    },
    [styles, retryUpload, imageOptions],
  );

  const ErrorImageMenuButton = ({ fileIndex, fileId }: { fileIndex: number; fileId: string }) => {
    return (
      <Popover
        placement="bottom"
        containerClassName={styles.pollPostComposer__errorImageOption__popOver__container}
        trigger={({ openPopover, isOpen, isDesktop, closePopover }) => {
          setIsPopoverOpen(isOpen);
          return (
            <AriaButton
              className={styles.pollPostComposer__errorImageOption__popOver__triggerButton}
              variant="text"
              onPress={() => {
                isDesktop
                  ? openPopover()
                  : setDrawerData({
                      content: errorImageMenu({
                        fileIndex,
                        closeMenu: () => {
                          closePopover();
                          removeDrawerData();
                        },
                        fileId,
                      }),
                    });
              }}
            />
          );
        }}
      >
        {({ closePopover }) => (
          <>{errorImageMenu({ fileIndex, closeMenu: closePopover, fileId })}</>
        )}
      </Popover>
    );
  };

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.pollPostComposerPage__container}
      data-open-popover={isPopoverOpen}
    >
      <Form
        id="pollPostComposer"
        className={styles.pollPostComposerPage__form}
        onSubmit={handleSubmit(validateAndSubmit)}
      >
        <div className={styles.pollPostComposerPage__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <CommunityDisplayName
            pageId={pageId}
            community={community}
            className={styles.pollPostComposerPage__topBar__displayName}
          />
          <AriaButton
            size="medium"
            variant="text"
            color="primary"
            type="submit"
            isDisabled={
              pollType === 'image' ? isDisabledImagePollSubmitButton : isDisabledSubmitButton
            }
          >
            {useString('amity_common_post')}
          </AriaButton>
        </div>
        <TextField name="title" className={styles.pollPostComposerPage__pollQuestion}>
          <FormLabel
            optional
            length={title.length}
            maxLength={MAX_POST_TITLE_LENGTH}
            elementId={ELEMENT_ID.POST_TITLE}
            componentId={COMPONENT_ID.WILD_CARD}
            pageId={PAGE_ID.POLL_POST_COMPOSER_PAGE}
            className={styles.pollPostComposerPage__postTitle__label}
            textKey="amity_social_label_poll_post_title"
          />
          <$TextArea
            data-testid="poll-post-composer-page-title-input"
            name="title"
            value={title}
            maxLength={MAX_POST_TITLE_LENGTH}
            placeholder={useString('amity_social_placeholder_hint_poll_headline')}
            className={styles.pollPostComposerPage__postTitle__input}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            onChange={(e) => {
              e.target.value.length > MAX_POST_TITLE_LENGTH
                ? setTitle(e.target.value.slice(0, MAX_POST_TITLE_LENGTH))
                : setTitle(e.target.value);
            }}
          />
        </TextField>
        <TextField name="question" className={styles.pollPostComposerPage__pollQuestion}>
          <Label className={styles.pollPostComposerPage__pollQuestion__label}>
            <PollQuestionTitle pageId={pageId} />
            <span className={styles.pollPostComposerPage__pollQuestion__limit}>
              {textValue.text.length}/{MAX_POLL_QUESTION_LENGTH}
            </span>
          </Label>
          <PostTextField
            data-input-validation={textValue.text.length <= MAX_POLL_QUESTION_LENGTH}
            isValidInput={textValue.text.length <= MAX_POLL_QUESTION_LENGTH}
            pageId={pageId}
            communityId={targetId}
            dataValue={{ data: { text: textValue.text }, links: textValue.links }}
            mentionContainer={mentionRef.current}
            onChange={onChange}
            className={styles.pollPostComposerPage__pollQuestion__input}
            placeholderClassName={styles.pollPostComposerPage__pollQuestion__placeholder}
            placeholder={useString('amity_social_placeholder_hint_poll_question')}
            attachmentAmount={0}
            isClipPost={false}
            isPollPost
          />
          {textValue.text.length > MAX_POLL_QUESTION_LENGTH && (
            <div className={styles.pollPostComposerPage__pollQuestion__validationWrap}>
              <Typography.Caption
                className={styles.pollPostComposerPage__pollQuestion__validationText}
              >
                {useString(
                  'amity_social_error_poll_question_char_limit_error',
                  MAX_POLL_QUESTION_LENGTH,
                )}
              </Typography.Caption>
            </div>
          )}
        </TextField>

        <div
          ref={mentionRef}
          className={styles.pollPostComposerPage__pollQuestion__mention}
          data-testid={`${pageId}/mention_text_input_options`}
        />

        <TextField name="answers" className={styles.pollPostComposerPage__pollOptions}>
          <Label className={styles.pollPostComposerPage__pollOptions__label}>
            <PollOptionsTitle pageId={pageId} />
            {pollType === 'text' ? (
              <PollOptionsDesc pageId={pageId} />
            ) : (
              <Typography.Caption className={styles.pollPostComposerPage__pollOptions__desc}>
                {useString('amity_social_label_poll_min_options_with_images')}
              </Typography.Caption>
            )}
          </Label>
          {pollType === 'text' ? (
            <div>
              {options.map((option, index) => (
                <div className={styles.pollPostComposerPage__pollOptions__options}>
                  <div className={styles.pollPostComposerPage__pollOptions__optionsWrapper}>
                    <TextArea
                      data-testid={`poll-option-${index + 1}`}
                      data-isvalid={option.data.length <= MAX_OPTION_LENGTH}
                      className={styles.pollPostComposerPage__pollOptions__input}
                      value={option.data}
                      placeholder={resolveString('amity_social_button_option_number', index + 1)}
                      onChange={(e) => updateOption(index, e.target.value)}
                      rows={1}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      data-testid={`poll-option-${index + 1}-delete-button`}
                      className={styles.pollPostComposerPage__pollOptions__trashButton}
                      onPress={() => deleteOption(index)}
                    >
                      <TrashIcon className={styles.pollPostComposerPage__pollOptions__trashIcon} />
                    </Button>
                  </div>
                  {option.data.length > MAX_OPTION_LENGTH && (
                    <div className={styles.pollPostComposerPage__pollOptions__validationWrap}>
                      <Typography.Caption
                        className={styles.pollPostComposerPage__pollQuestion__validationText}
                      >
                        {useString(
                          'amity_social_error_poll_option_char_limit_error',
                          MAX_OPTION_LENGTH,
                        )}
                      </Typography.Caption>
                    </div>
                  )}
                </div>
              ))}
              {options.length < MAX_OPTIONS && (
                <PollAddOptionButton onPress={addOption} pageId={pageId} />
              )}
            </div>
          ) : (
            <div className={styles.pollPostComposerPage__imagePollOptions__wrapper}>
              {imageOptions.map((option, index) => (
                <div key={index} className={styles.pollPostComposerPage__imagePollOptions}>
                  <Button
                    className={styles.pollPostComposerPage__imagePollOptions__closeButton}
                    onPress={() => deleteImageOption(index)}
                  >
                    <CloseCircle
                      className={styles.pollPostComposerPage__imagePollOptions__closeIcon}
                    />
                  </Button>
                  <div className={styles.pollPostComposerPage__imagePollOptions__card}>
                    <input
                      className={styles.uploadPollImage_input}
                      type="file"
                      onChange={(e) => onChangeImage(e, index)}
                      id={`upload-${index}`}
                      accept={'image/png,image/jpeg'}
                    />
                    {option.id && typeof option.indexOfFiles === 'number' ? (
                      <Button
                        className={styles.pollPostComposerPage__imagePollOptions__image}
                        onPress={() => triggerFileInput(index)}
                        data-testid={`image-poll-option-uploaded-image-${index + 1}`}
                      >
                        <ImageThumbnail
                          files={[files[option.indexOfFiles]]}
                          pageId={pageId}
                          progress={progress}
                          removeFile={removeFile}
                          onAltTextChange={handleAltTextChange}
                          isImagePollPost
                          ErrorImageMenuButton={() =>
                            typeof option.indexOfFiles === 'number' &&
                            ErrorImageMenuButton({
                              fileIndex: index,
                              fileId: files[option.indexOfFiles].id,
                            })
                          }
                        />
                      </Button>
                    ) : (
                      <Button
                        onPress={() => triggerFileInput(index)}
                        isDisabled={isLoading}
                        className={styles.pollPostComposerPage__imagePollOptions__uploadButton}
                        data-testid={`image-poll-option-upload-button-${index + 1}`}
                      >
                        <UploadImageArea />
                      </Button>
                    )}
                    <TextField
                      data-isvalid={option.data.length <= MAX_OPTION_LENGTH}
                      value={option.data}
                      onChange={(text) => updateImageOption(index, text)}
                      onKeyDown={handleKeyDown}
                    >
                      <Input
                        className={styles.pollPostComposerPage__pollOptions__input}
                        data-image-poll={true}
                        placeholder={resolveString('amity_social_button_option_number', index + 1)}
                      />
                    </TextField>
                  </div>
                </div>
              ))}
              {imageOptions.length < MAX_OPTIONS && (
                <div className={styles.pollPostComposerPage__imagePollOptions__card}>
                  <div
                    onClick={addImageOption}
                    className={styles.pollPostComposerPage__imagePollOptions__addImageOption}
                  >
                    <Plus className={styles.pollPostComposerPage__imagePollOptions__plusIcon} />
                    <Typography.CaptionBold
                      className={styles.pollPostComposerPage__imagePollOptions__addOptionCaption}
                    >
                      {useString('amity_social_button_add_option')}
                    </Typography.CaptionBold>
                  </div>
                </div>
              )}
            </div>
          )}
        </TextField>

        <TextField name="answerType" className={styles.pollPostComposerPage__answerType}>
          <Label>
            <PollMultipleSelectionTitle pageId={pageId} />
            <PollMultipleSelectionDesc pageId={pageId} />
          </Label>
          <Switch isSelected={isMultiple} onChange={handleToggleChange} data-testid={pageId} />
        </TextField>

        <TextField
          aria-label="pick-date-time"
          name="closedIn"
          className={styles.pollPostComposerPage__duration}
        >
          <Label>
            <PollDurationTitle pageId={pageId} />
            <PollDurationDesc pageId={pageId} />
          </Label>
          <Popover
            placement="bottom"
            trigger={({ isDesktop, isOpen, openPopover, closePopover }) => {
              return (
                <Button
                  className={styles.pollPostComposerPage__duration__button}
                  onPress={() => {
                    isDesktop
                      ? openPopover()
                      : setDrawerData({
                          content: (
                            <PollDurationOptions
                              pageId={pageId}
                              timeDuration={timeDuration}
                              duration={duration}
                              selectedDate={selectedDate}
                              selectedTime={selectedTime}
                              onChange={onDurationChange}
                              onClose={removeDrawerData}
                              onChangeDate={onChangeDate}
                              onChangeTime={onChangeTime}
                            />
                          ),
                        });
                  }}
                >
                  <Typography.Body data-testid="poll-duration">
                    {selectedDate
                      ? useString('amity_social_poll_post_composer_page_ends_on')
                          .replace('%s', formatEndDate ?? '')
                          .replace('%s', formatEndTime ?? '')
                      : duration && duration.label}
                  </Typography.Body>
                  <DropdownIcon className={styles.pollPostComposerPage__duration__dropdownIcon} />
                </Button>
              );
            }}
            aria-label="poll_duration_options"
          >
            {({ closePopover }) => (
              <PollDurationOptions
                pageId={pageId}
                timeDuration={timeDuration}
                duration={duration}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onChange={onDurationChange}
                onClose={closePopover}
                onChangeDate={onChangeDate}
                onChangeTime={onChangeTime}
              />
            )}
          </Popover>
        </TextField>

        {!selectedDate && (
          <div className={styles.pollPostComposerPage__duration__captionWrap}>
            <Typography.Caption
              data-testid="poll-duration"
              className={styles.pollPostComposerPage__duration__caption}
            >
              {useString('amity_social_poll_post_composer_page_ends_on')
                .replace('%s', formattedDate ?? '')
                .replace('%s', formatEndTime ?? '')}
            </Typography.Caption>
          </div>
        )}

        {isDesktop && (
          <div className={styles.pollPostComposerPage__postButtonWrap}>
            <AriaButton
              data-testid="poll-post-composer-page-submit-button"
              type="submit"
              className={styles.pollPostComposerPage__postButton}
              isDisabled={
                pollType === 'image' ? isDisabledImagePollSubmitButton : isDisabledSubmitButton
              }
            >
              {useString('amity_social_button_post_composer_create_button')}
            </AriaButton>
          </div>
        )}
      </Form>

      <div className={styles.pollPostComposerPage__notificationWrapper}>
        {isCreating && (
          <Notification
            icon={<Spinner />}
            content={useString('amity_social_toast_poll_create_posting_toast')}
            alignment="fixed"
          />
        )}
        {isError && (
          <Notification
            duration={3000}
            content={useString('amity_social_toast_post_create_generic_error_message')}
            alignment="fixed"
            icon={<ExclamationCircle className={styles.createPost_notificationIcon} />}
          />
        )}
      </div>
    </div>
  );
};
