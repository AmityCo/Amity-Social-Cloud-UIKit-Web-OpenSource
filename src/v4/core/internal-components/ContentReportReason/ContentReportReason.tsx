import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { ContentFlagReasonEnum } from '@amityco/ts-sdk';
import clsx from 'clsx';
import { BackButton, CloseButton } from '~/v4/social/elements';
import { Typography } from '~/v4/core/components';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import AngleRight from '~/v4/icons/AngleRight';
import { Button } from '~/v4/core/components/AriaButton';
import { TextArea, TextField } from '~/v4/core/components/TextField';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './ContentReportReason.module.css';
import { usePostFlaggedByMe } from '~/v4/core/hooks/usePostFlaggedByMe';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useCommentFlaggedByMe } from '~/v4/social/hooks/useCommentFlaggedByMe';
import { useFlagMessageQuery } from '~/v4/chat/hooks/queries';
import { useMessageObject } from '~/v4/chat/hooks/objects';
import { useNetworkState } from 'react-use';

type ContentReportReasonProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
  onCloseMenu?: () => void;
  post?: Amity.Post;
  comment?: Amity.Comment;
  message?: Amity.Message;
  messageType?: 'live-chat' | 'chat';
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
  messageType = 'chat',
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

  const postReportedText = useString('amity_social_button_post_reported');
  const postReportFailedText = useString('amity_social_toast_post_report_failed');
  const postUnreportedText = useString('amity_social_button_post_unreported');
  const postUnreportFailedText = useString('amity_social_toast_post_unreport_failed');
  const othersTitle = useString('amity_social_button_others');
  const reportReasonTitle = useString('amity_social_button_report_reason');
  const reportOtherReasonDesc = useString('amity_social_label_report_other_reason_desc');
  const reportOtherReasonOptional = useString('amity_social_button_report_other_reason_optional');
  const reportTextPlaceholder = useString('amity_social_placeholder_report_text_placeholder');
  const reportListDescription = useString('amity_social_report_list_screen_description');
  const closeButtonText = useString('amity_social_modal_dialog_close_button');
  const submitButtonText = useString('amity_social_button_report_submit_button');

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
      return reportMessage({
        reason: selectedReason === ContentFlagReasonEnum.Others ? otherReasonText : selectedReason,
        onSuccess: handleCloseReportReason,
      });
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
      success({ content: postReportedText });
      onCloseMenu?.();
      closePopup();
    },
    onReportError: (error) => {
      if (error.message?.includes('400400')) {
        setIsError(true);
      } else {
        info({
          content: postReportFailedText,
          alignment: isDesktop ? 'fullscreen' : 'withSidebar',
        });
      }
    },
    onUnreportSuccess: () => {
      success({ content: postUnreportedText });
      onCloseMenu?.();
    },
    onUnreportError: () => {
      info({
        content: postUnreportFailedText,
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

  const {
    report: reportMessage,
    isPending: isMessageReportLoading,
    isMessageDeleted: isMessageDeletedFromReport,
  } = useFlagMessageQuery({
    messageId: message?.messageId as string,
    enabled: !!message,
    toastAlignment: messageType === 'live-chat' ? 'live-chat' : undefined,
  });

  const { message: liveMessage } = useMessageObject({
    messageId: message?.messageId,
  });
  const isMessageDeleted = isMessageDeletedFromReport || !!liveMessage?.isDeleted;

  const isDisabledSubmitButton =
    !selectedReason ||
    !online ||
    isReportPending ||
    isReportCommentLoading ||
    isMessageReportLoading;

  useEffect(() => {
    if (!online) {
      info({
        content: resolveString('amity_social_label_no_internet_connection'),
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
    }
  }, [online]);

  const reportReasons = useMemo(() => {
    const reasons = [
      {
        value: ContentFlagReasonEnum.CommunityGuidelines,
        labelKey: 'amity_social_label_report_reason_community_guidelines',
      },
      {
        value: ContentFlagReasonEnum.HarassmentOrBullying,
        labelKey: 'amity_social_label_report_reason_harassment_or_bullying',
      },
      {
        value: ContentFlagReasonEnum.SelfHarmOrSuicide,
        labelKey: 'amity_social_label_report_reason_self_harm_or_suicide',
      },
      {
        value: ContentFlagReasonEnum.ViolenceOrThreateningContent,
        labelKey: 'amity_social_label_report_reason_violence_or_threatening',
      },
      {
        value: ContentFlagReasonEnum.SellingRestrictedItems,
        labelKey: 'amity_social_label_report_reason_selling_restricted',
      },
      {
        value: ContentFlagReasonEnum.SexualContentOrNudity,
        labelKey: 'amity_social_label_report_reason_sexual_content_or_nudity',
      },
      {
        value: ContentFlagReasonEnum.SpamOrScams,
        labelKey: 'amity_social_label_report_reason_spam_or_scams',
      },
      {
        value: ContentFlagReasonEnum.FalseInformation,
        labelKey: 'amity_social_label_report_reason_false_information',
      },
      {
        value: ContentFlagReasonEnum.Others,
        labelKey: 'amity_social_button_others',
        hasAngleRight: true,
      },
    ];

    return reasons;
  }, []);

  return (
    <div
      data-iserror={isError || isCommentDeleted || isMessageDeleted}
      className={clsx(styles.contentReportReason__container, className)}
    >
      {isError || isCommentDeleted || isMessageDeleted ? (
        <FailedToShow allowBack={false} className={styles.contentReportReason__failed} />
      ) : (
        <>
          <div className={styles.contentReportReason__titleContainer}>
            <div className={styles.contentReportReason__titleContainer__leftSlot}>
              {isShowOthersOption && (
                <BackButton
                  onPress={() => {
                    setSelectedReason(undefined);
                    setIsShowOthersOption(false);
                  }}
                />
              )}
            </div>
            <div className={styles.contentReportReason__titleContainer__centerSlot}>
              <Typography.TitleBold className={styles.contentReportReason__title}>
                {isShowOthersOption ? othersTitle : reportReasonTitle}
              </Typography.TitleBold>
            </div>
            <div className={styles.contentReportReason__titleContainer__rightSlot}>
              <CloseButton
                onPress={handleCloseReportReason}
                defaultClassName={styles.contentReportReason__closeButton}
              />
            </div>
          </div>

          <div className={styles.contentReportReason__content}>
            {isShowOthersOption ? (
              <div>
                <TextField
                  label={reportOtherReasonDesc}
                  description={reportOtherReasonOptional}
                  isShowCounter
                  isRequired={false}
                  maxLength={MAX_LENGTH_DESCRIBE}
                  counter={(value) => `${value.length}/${MAX_LENGTH_DESCRIBE}`}
                  labelClassName={styles.contentReportReason__textInput__label}
                  value={otherReasonText}
                >
                  <TextArea
                    placeholder={reportTextPlaceholder}
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
                  {reportListDescription}
                </Typography.Caption>
                <RadioGroup
                  className={styles.contentReportReason__radioGroup}
                  radios={reportReasons.map((reason) => ({
                    value: reason.value,
                    label: (
                      <Typography.BodyBold className={styles.contentReportReason__option}>
                        {resolveString(reason.labelKey)}
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
        {isError || isCommentDeleted || isMessageDeleted ? (
          <Button
            data-testid={`${pageId}/${componentId}/close_button`}
            className={styles.contentReportReason__submitButton}
            onPress={handleCloseReportReason}
          >
            {closeButtonText}
          </Button>
        ) : (
          <Button
            data-testid={`${pageId}/${componentId}/submit_button`}
            isDisabled={isDisabledSubmitButton}
            type="submit"
            className={styles.contentReportReason__submitButton}
            onPress={handleSubmitReport}
          >
            {submitButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
