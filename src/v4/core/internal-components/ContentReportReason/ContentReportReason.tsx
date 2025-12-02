import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { ContentFlagReasonEnum } from '@amityco/ts-sdk';
import clsx from 'clsx';
import { BackButton, CloseButton } from '~/v4/social/elements';
import { Typography } from '~/v4/core/components';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import AngleRight from '~/v4/icons/AngleRight';
import { Button } from '~/v4/core/components/AriaButton';
import { TextArea, TextField } from '~/v4/core/components/TextField';
import { useNetworkState } from 'react-use';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './ContentReportReason.module.css';
import { usePostFlaggedByMe } from '~/v4/core/hooks/usePostFlaggedByMe';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useCommentFlaggedByMe } from '~/v4/social/hooks/useCommentFlaggedByMe';
import { useMessageFlaggedByMe } from '~/v4/chat/hooks/useMessageFlaggedByMe';

type ContentReportReasonProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
  onCloseMenu?: () => void;
  post?: Amity.Post;
  comment?: Amity.Comment;
  message?: Amity.Message;
  showReportPostButton: boolean;
};

export const ContentReportReason = ({
  pageId = '*',
  componentId = '*',
  className,
  onCloseMenu,
  post,
  comment,
  message,
  showReportPostButton,
}: ContentReportReasonProps) => {
  const MAX_LENGTH_DESCRIBE = 300;

  const [isShowOthersOption, setIsShowOthersOption] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [selectedReason, setSelectedReason] = useState<Amity.ContentFlagReason | undefined>(
    undefined,
  );
  const [isError, setIsError] = useState(false);
  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();
  const { success, info } = useNotifications();
  const { closePopup } = usePopupContext();

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReasonText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleSubmitReport = () => {
    if (post) return mutateReportPost();
    if (comment) return mutateReportComment();
    if (message)
      return mutateReportMessage(
        selectedReason === ContentFlagReasonEnum.Others ? otherReasonText : selectedReason,
      );
    return;
  };

  const handleRadioChange = (value: string) => {
    const reason = value as ContentFlagReasonEnum;
    setSelectedReason(reason);

    if (reason === ContentFlagReasonEnum.Others) {
      setIsShowOthersOption(true);
    }
  };

  const handleCloseReportReason = () => {
    closePopup();
    onCloseMenu?.();
  };

  const {
    isLoading: isReportPostLoading,
    isPending: isReportPending,
    mutateReportPost,
  } = usePostFlaggedByMe({
    post,
    reasonReport:
      selectedReason === ContentFlagReasonEnum.Others ? otherReasonText : selectedReason,
    isFlaggable: showReportPostButton,
    onReportSuccess: () => {
      success({ content: 'Post reported.' });
      onCloseMenu?.();
      closePopup();
    },
    onReportError: (error) => {
      if (error.message?.includes('400400')) {
        setIsError(true);
      } else {
        info({
          content: 'Failed to report post. Please try again.',
          alignment: isDesktop ? 'fullscreen' : 'withSidebar',
        });
      }
    },
    onUnreportSuccess: () => {
      success({ content: 'Post unreported.' });
      onCloseMenu?.();
    },
    onUnreportError: () => {
      info({
        content: 'Failed to unreport post. Please try again.',
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
      onCloseMenu?.();
    },
  });

  const {
    mutateReportComment,
    isCommentDeleted,
    isFlagLoading: isReportCommentLoading,
  } = useCommentFlaggedByMe({
    commentId: comment?.commentId as string,
    reasonReport:
      selectedReason === ContentFlagReasonEnum.Others ? otherReasonText : selectedReason,
    onCloseMenu: handleCloseReportReason,
    isReplyComment: comment?.parentId != null,
  });

  const { mutateReportMessage, isPending: isMessageReportLoading } = useMessageFlaggedByMe({
    messageId: message?.messageId as string,
    onCloseMenu: handleCloseReportReason,
  });

  const isDisabledSubmitButton =
    !selectedReason ||
    !online ||
    isReportPending ||
    isReportCommentLoading ||
    isMessageReportLoading;

  useEffect(() => {
    if (!online) {
      info({
        content: 'No internet connection.',
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
    }
  }, [online]);

  const reportReasons = useMemo(() => {
    const reasons = [
      {
        value: ContentFlagReasonEnum.CommunityGuidelines,
      },
      {
        value: ContentFlagReasonEnum.HarassmentOrBullying,
      },
      {
        value: ContentFlagReasonEnum.SelfHarmOrSuicide,
      },
      {
        value: ContentFlagReasonEnum.ViolenceOrThreateningContent,
      },
      {
        value: ContentFlagReasonEnum.SellingRestrictedItems,
      },
      {
        value: ContentFlagReasonEnum.SexualContentOrNudity,
      },
      {
        value: ContentFlagReasonEnum.SpamOrScams,
      },
      {
        value: ContentFlagReasonEnum.FalseInformation,
      },
      {
        value: ContentFlagReasonEnum.Others,
        hasAngleRight: true,
      },
    ];

    return reasons;
  }, []);

  return (
    <div
      data-iserror={isError || isCommentDeleted}
      className={clsx(styles.contentReportReason__container, className)}
    >
      {isError || isCommentDeleted ? (
        <FailedToShow className={styles.contentReportReason__failed} />
      ) : (
        <>
          <div className={styles.contentReportReason__titleContainer}>
            <div
              data-options={!isDesktop && isShowOthersOption}
              className={styles.contentReportReason__titleContainer__leftMenu}
            >
              {isShowOthersOption ? (
                <BackButton
                  onPress={() => {
                    setSelectedReason(undefined);
                    setIsShowOthersOption(false);
                  }}
                />
              ) : (
                <div className={styles.contentReportReason__leftSpace} />
              )}
              <Typography.TitleBold className={styles.contentReportReason__title}>
                {isShowOthersOption ? 'Others' : 'Report reason'}
              </Typography.TitleBold>
            </div>

            <CloseButton
              onPress={handleCloseReportReason}
              defaultClassName={styles.contentReportReason__closeButton}
            />
          </div>

          <div className={styles.contentReportReason__content}>
            {isShowOthersOption ? (
              <div>
                <TextField
                  label="Describe the reason"
                  description="(Optional)"
                  isShowCounter
                  isRequired={false}
                  maxLength={MAX_LENGTH_DESCRIBE}
                  counter={(value) => `${value.length}/${MAX_LENGTH_DESCRIBE}`}
                  labelClassName={styles.contentReportReason__textInput__label}
                  value={otherReasonText}
                >
                  <TextArea
                    placeholder="Share more details about this issue"
                    value={otherReasonText}
                    onChange={handleTextAreaChange}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_LENGTH_DESCRIBE}
                    disabled={isReportPostLoading || isReportCommentLoading}
                  />
                </TextField>
              </div>
            ) : (
              <>
                <Typography.Caption as="p" className={styles.contentReportReason__description}>
                  Tell us why you're reporting this content. Your report will be reviewed by our
                  moderators and kept confidential.
                </Typography.Caption>
                <RadioGroup
                  className={styles.contentReportReason__radioGroup}
                  radios={reportReasons.map((reason) => ({
                    value: reason.value,
                    label: (
                      <Typography.BodyBold className={styles.contentReportReason__option}>
                        {reason.value}
                      </Typography.BodyBold>
                    ),
                    isDisabled: isReportPostLoading || isReportCommentLoading,
                    ...(reason.hasAngleRight && {
                      icon: <AngleRight className={styles.contentReportReason__angleRight} />,
                      onIconClick: () => {
                        setSelectedReason(ContentFlagReasonEnum.Others);
                        setIsShowOthersOption(true);
                      },
                    }),
                  }))}
                  onChange={handleRadioChange}
                  value={selectedReason || undefined}
                />
              </>
            )}
          </div>
        </>
      )}

      <div className={styles.contentReportReason__bottomContainer}>
        {isError || isCommentDeleted ? (
          <Button
            data-testid={`${pageId}/${componentId}/close_button`}
            className={styles.contentReportReason__submitButton}
            onPress={handleCloseReportReason}
          >
            Close
          </Button>
        ) : (
          <Button
            data-testid={`${pageId}/${componentId}/submit_button`}
            isDisabled={isDisabledSubmitButton}
            type="submit"
            className={styles.contentReportReason__submitButton}
            onPress={handleSubmitReport}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};
