import React, { useState, ChangeEvent, useEffect } from 'react';
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

type ContentReportReasonProps = {
  pageId?: string;
  componentId?: string;
  handleSubmit?: (reason: ContentFlagReasonEnum | (string & Record<string, never>)) => void;
  isError?: boolean;
  isLoading?: boolean;
  className?: string;
  onClose: () => void;
};

export const ContentReportReason = ({
  pageId = '*',
  componentId = '*',
  handleSubmit,
  isError = false,
  isLoading = false,
  className,
  onClose,
}: ContentReportReasonProps) => {
  const MAX_LENGTH_DESCRIBE = 300;

  const [isShowOthersOption, setIsShowOthersOption] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [selectedReason, setSelectedReason] = useState<ContentFlagReasonEnum | null>(null);
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { isDesktop } = useResponsive();

  const isDisabledSubmitButton = !selectedReason || !online || isLoading;

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReasonText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleSubmitReport = () => {
    selectedReason === ContentFlagReasonEnum.Others
      ? handleSubmit?.(otherReasonText as string & Record<string, never>)
      : handleSubmit?.(selectedReason as ContentFlagReasonEnum);
  };

  const handleRadioChange = (value: string) => {
    const reason = value as ContentFlagReasonEnum;
    setSelectedReason(reason);

    if (reason === ContentFlagReasonEnum.Others) {
      setIsShowOthersOption(true);
    }
  };

  useEffect(() => {
    if (!online) {
      notification.info({
        content: 'No internet connection.',
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
    }
  }, [online]);

  return (
    <div className={clsx(styles.contentReportReason__container, className)}>
      {isError ? (
        <FailedToShow className={styles.contentReportReason__failed} />
      ) : (
        <>
          <div className={styles.contentReportReason__titleContainer}>
            <div className={styles.contentReportReason__titleContainer__leftMenu}>
              {isShowOthersOption ? (
                <BackButton
                  onPress={() => {
                    setSelectedReason(null);
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

            <CloseButton onPress={onClose} />
          </div>

          <div className={styles.contentReportReason__content}>
            {isShowOthersOption ? (
              <div className={styles.contentReportReason__describeReason}>
                <TextField
                  label="Describe the reason"
                  description="(Optional)"
                  isShowCounter
                  isRequired={false}
                  maxLength={MAX_LENGTH_DESCRIBE}
                  counter={(value) => `${value.length}/${MAX_LENGTH_DESCRIBE}`}
                  className={styles.contentReportReason__textField}
                  value={otherReasonText}
                >
                  <TextArea
                    placeholder="Share more details about this issue"
                    value={otherReasonText}
                    onChange={handleTextAreaChange}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_LENGTH_DESCRIBE}
                    disabled={isLoading}
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
                  radios={[
                    {
                      value: ContentFlagReasonEnum.CommunityGuidelines,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Against community guidelines
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                    },
                    {
                      value: ContentFlagReasonEnum.HarassmentOrBullying,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Harassment or bullying
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                    },
                    {
                      value: ContentFlagReasonEnum.ViolenceOrThreateningContent,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Violence or threatening content
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                    },
                    {
                      value: ContentFlagReasonEnum.SellingRestrictedItems,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Selling and promoting restricted items
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                    },
                    {
                      value: ContentFlagReasonEnum.SexualContentOrNudity,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Sexual content or nudity
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                    },
                    {
                      value: ContentFlagReasonEnum.SpamOrScams,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Spam or scams
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                    },
                    {
                      value: ContentFlagReasonEnum.Others,
                      label: (
                        <Typography.BodyBold className={styles.contentReportReason__option}>
                          Others
                        </Typography.BodyBold>
                      ),
                      isDisabled: isLoading,
                      icon: <AngleRight className={styles.contentReportReason__angleRight} />,
                      onIconClick: () => {
                        setSelectedReason(ContentFlagReasonEnum.Others);
                        setIsShowOthersOption(true);
                      },
                    },
                  ]}
                  onChange={handleRadioChange}
                  value={selectedReason || undefined}
                />
              </>
            )}
          </div>
        </>
      )}

      <div className={styles.contentReportReason__bottomContainer}>
        {isError ? (
          <Button
            data-testid={`${pageId}/${componentId}/close_button`}
            className={styles.contentReportReason__submitButton}
            onPress={onClose}
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
