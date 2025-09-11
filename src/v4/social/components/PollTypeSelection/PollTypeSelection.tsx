import React, { useState } from 'react';
import styles from './PollTypeSelection.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { ImagePollSvg, TextPollSvg } from './PollTypeIcons';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { PollPostComposerPage } from '~/v4/social/pages/PollPostComposerPage';

export type PollTypeSelectionProps = {
  targetType: 'community' | 'user';
  targetId: string | null;
  onClickNext?: () => void;
  target?: Amity.Community | null;
};

export function PollTypeSelection({
  targetId,
  targetType,
  target,
  onClickNext,
}: PollTypeSelectionProps) {
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { AmityPollTargetSelectionPageBehavior } = usePageBehavior();
  const [selectedPollType, setSelectedPollType] = useState<'text' | 'image'>('text');

  const onClickNextButton = () => {
    isDesktop
      ? openPopup({
          pageId: 'post_composer_page',
          view: 'desktop',
          isDismissable: false,
          onClose: ({ close }) => {
            confirm({
              onOk: close,
              type: 'confirm',
              okText: 'Discard',
              cancelText: 'Keep editing',
              title: 'Discard this post?',
              pageId: 'post_composer_page',
              content: 'The post will be permanently discarded. It cannot be undone.',
            });
          },
          header: (
            <CommunityDisplayName
              community={target}
              pageId="post_composer_page"
              className={styles.pollTypeSelection__displayName}
            />
          ),
          children: (
            <PollPostComposerPage
              targetId={targetId}
              targetType={targetType}
              pollType={selectedPollType}
            />
          ),
        })
      : AmityPollTargetSelectionPageBehavior?.goToPollPostComposerPage?.({
          targetType: targetType,
          targetId: targetId,
          pollType: selectedPollType,
        });
    onClickNext && onClickNext();
  };

  return (
    <div className={styles.pollTypeSelection}>
      <Typography.TitleBold className={styles.pollTypeSelection__title}>
        Choose poll type
      </Typography.TitleBold>
      <div className={styles.pollTypeSelection__line} />

      <div className={styles.pollTypeSelection__cardWrapper}>
        <div
          onClick={() => setSelectedPollType('text')}
          data-selected={selectedPollType === 'text' ? true : undefined}
          className={styles.pollTypeSelection__card}
        >
          <TextPollSvg
            data-selected={selectedPollType === 'text' ? true : undefined}
            isActive={selectedPollType === 'text' ? true : false}
            className={styles.pollTypeSelection__iconCard}
          />
          <Typography.BodyBold className={styles.pollTypeSelection__textCard}>
            Text-only poll
          </Typography.BodyBold>
        </div>
        <div
          onClick={() => setSelectedPollType('image')}
          data-selected={selectedPollType === 'image' ? true : undefined}
          className={styles.pollTypeSelection__card}
        >
          <ImagePollSvg
            data-selected={selectedPollType === 'image' ? true : undefined}
            isActive={selectedPollType === 'image' ? true : false}
            className={styles.pollTypeSelection__iconCard}
          />
          <Typography.BodyBold className={styles.pollTypeSelection__textCard}>
            Image poll
          </Typography.BodyBold>
        </div>
      </div>
      <div className={styles.pollTypeSelection__line} />
      <Button onPress={onClickNextButton} className={styles.pollTypeSelection__button}>
        <Typography.Body>Next</Typography.Body>
      </Button>
    </div>
  );
}
