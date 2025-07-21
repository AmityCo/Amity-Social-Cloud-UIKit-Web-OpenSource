import React, { useRef, useState } from 'react';
import styles from './PollPostComposerPage.module.css';
import { Form, Label, TextArea, TextField } from 'react-aria-components';
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
import { CommunityPostSettings, PollRepository, PostRepository } from '@amityco/ts-sdk';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { MAXIMUM_POST_CHARACTERS } from '~/v4/social/constants';
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

type PollPostComposerPageProps = {
  targetId: string | null;
  targetType: 'community' | 'user';
};

type FormValues = Parameters<typeof PollRepository.createPoll>[0];

const MAX_POLL_QUESTION_LENGTH = 500;
const MAX_OPTIONS = 10;
const MAX_OPTION_LENGTH = 60;
const MILLISECONDS_IN_DAY = 86400000;

const timeDuration = [
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
];

export type CreatePollPostParams = {
  pollId: string;
  text: string;
  mentioned: Mentioned[];
  mentionees: Mentionees;
};

export const PollPostComposerPage = ({ targetId, targetType }: PollPostComposerPageProps) => {
  const pageId = 'poll_post_composer_page';

  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { onBack, prevPage } = useNavigation();
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

  const timeNow = now(getLocalTimeZone());
  const { prependItem } = useGlobalFeedContext();
  const { isDesktop } = useResponsive();

  const [isCreating, setIsCreating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [options, setOptions] = useState([
    { dataType: 'text', data: '' },
    { dataType: 'text', data: '' },
  ]);
  const [isMultiple, setIsMultiple] = useState(false);

  //Poll options radio value
  const [duration, setDuration] = useState<{ value: number; label: string } | undefined>(
    timeDuration[4],
  );

  const [selectedDate, setSelectedDate] = useState<CalendarDate | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Time | undefined>(undefined);

  //Create poll post
  const [textValue, setTextValue] = useState<CreatePollPostParams>({
    pollId: '',
    text: '',
    mentioned: [],
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
  });

  const answerType = isMultiple ? 'multiple' : 'single';

  const formatEndTime = selectedTime
    ? formatTime(selectedTime)
    : formatTime(new Time(timeNow.hour, timeNow.minute));

  const formatEndDate =
    selectedDate &&
    new Intl.DateTimeFormat('en-GB', {
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
          content:
            'Your post has been submitted to pending list. It will be review by community moderator.',
          okText: 'OK',
        });
      } else {
        prependItem(postData.data);
      }
    } catch (error: unknown) {
      setIsError(true);
      if (error instanceof Error) {
        if (error.message === ERROR_RESPONSE.CONTAIN_BLOCKED_WORD) {
          notification.info({
            content: 'Text contain blocked word.',
          });
        }
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
        title: 'Unable to post',
        content: 'You have reached maximum 50,000 characters in a post.',
        okText: 'Done',
      });
      return;
    }

    const createPostParams: Parameters<typeof PostRepository.createPost>[0] = {
      targetId: targetId!,
      targetType: targetType,
      data: { pollId, text: textValue.text },
      dataType: 'poll',
      metadata: { mentioned: textValue.mentioned },
      mentionees: textValue.mentionees as Amity.UserMention[],
      attachments: [],
    };

    return createPost(createPostParams);
  }

  const validateAndSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!online) {
      notification.info({
        content: 'Failed to create post. Please try again.',
        alignment: 'fixed',
      });
      return;
    }
    try {
      setIsCreating(true);

      const payload = {
        question: textValue.text,
        answers: options,
        answerType,
        closedIn,
      };

      const createdPoll = await PollRepository.createPoll(
        payload as Parameters<typeof PollRepository.createPoll>[0],
      );
      await onCreatePost(createdPoll.data.pollId);
    } finally {
      setIsCreating(false);
      isDesktop && closePopup();
    }
  };

  const onClickClose = () => {
    if (!isDirty)
      return prevPage?.type == PageTypes.PollTargetSelectionPage ? onBack(-2) : onBack();
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently discarded. It cannot be undone.',
      onOk: () => {
        prevPage?.type == PageTypes.PollTargetSelectionPage ? onBack(-2) : onBack();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  const onChange = (val: { mentioned: Mentioned[]; mentionees: Mentionees; text: string }) =>
    setTextValue((prev) => ({
      ...prev,
      mentioned: val.mentioned,
      text: val.text,
      mentionees: val.mentionees,
    }));

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, { dataType: 'text', data: '' }]);
    }
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, data: value } : option,
    );
    setOptions(updatedOptions);
  };

  const deleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
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
    options.some(
      (option) =>
        option.data.length > MAX_OPTION_LENGTH ||
        option.data.length === 0 ||
        option.data.trim() === '',
    );

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.pollPostComposerPage__container}
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
            isDisabled={isDisabledSubmitButton}
          >
            Post
          </AriaButton>
        </div>
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
            dataValue={{ data: { text: textValue.text } }}
            mentionContainer={mentionRef.current}
            onChange={onChange}
            className={styles.pollPostComposerPage__pollQuestion__input}
            placeholderClassName={styles.pollPostComposerPage__pollQuestion__placeholder}
            placeholder="What’s your poll question?"
          />
          {textValue.text.length > MAX_POLL_QUESTION_LENGTH && (
            <div className={styles.pollPostComposerPage__pollQuestion__validationWrap}>
              <Typography.Caption
                className={styles.pollPostComposerPage__pollQuestion__validationText}
              >
                Poll question cannot exceed 500 characters.
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
            <PollOptionsDesc pageId={pageId} />
          </Label>
          {options.map((option, index) => (
            <div className={styles.pollPostComposerPage__pollOptions__options}>
              <div className={styles.pollPostComposerPage__pollOptions__optionsWrapper}>
                <TextArea
                  data-isvalid={option.data.length <= MAX_OPTION_LENGTH}
                  className={styles.pollPostComposerPage__pollOptions__input}
                  value={option.data}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => updateOption(index, e.target.value)}
                  rows={1}
                  onKeyDown={handleKeyDown}
                />
                <Button
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
                    Poll option cannot exceed 60 characters.
                  </Typography.Caption>
                </div>
              )}
            </div>
          ))}
          {options.length < MAX_OPTIONS && (
            <PollAddOptionButton onPress={addOption} pageId={pageId} />
          )}
        </TextField>

        <TextField name="answerType" className={styles.pollPostComposerPage__answerType}>
          <Label className={styles.pollPostComposerPage__answerType__label}>
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
                  <Typography.Body>
                    {selectedDate
                      ? `Ends on ${formatEndDate} at ${formatEndTime}`
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
            <Typography.Caption className={styles.pollPostComposerPage__duration__caption}>
              {`Ends on ${formattedDate} at ${formatEndTime}`}
            </Typography.Caption>
          </div>
        )}

        {isDesktop && (
          <div className={styles.pollPostComposerPage__postButtonWrap}>
            <AriaButton
              type="submit"
              isDisabled={isDisabledSubmitButton}
              className={styles.pollPostComposerPage__postButton}
            >
              Post
            </AriaButton>
          </div>
        )}
      </Form>

      <div className={styles.pollPostComposerPage__notificationWrapper}>
        {isCreating && (
          <>
            <div className={styles.pollPostComposerPage__overlay} />
            <Notification icon={<Spinner />} content="Posting..." alignment="fixed" />
          </>
        )}
        {isError && (
          <>
            <div className={styles.pollPostComposerPage__overlay} />

            <Notification
              duration={3000}
              content="Failed to create post"
              alignment="fixed"
              icon={<ExclamationCircle className={styles.createPost_notificationIcon} />}
            />
          </>
        )}
      </div>
    </div>
  );
};
