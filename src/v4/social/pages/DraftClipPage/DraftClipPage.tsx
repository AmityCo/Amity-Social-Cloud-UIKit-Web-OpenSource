import React, { useEffect } from 'react';
import { resolveString, useString } from '~/v4/core/localization';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { AspectRatioButton } from '~/v4/social/elements';
import { RoundedBackButton } from '~/v4/social/elements/RoundedBackButton';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { MuteButton } from '~/v4/social/elements/MuteButton/MuteButton';
import { NextButton } from '~/v4/social/elements/NextButton/NextButton';
import { useFilePostUpload } from '~/v4/social/hooks/useFilePostUpload';
import { FileType } from '@amityco/ts-sdk';
import { Spinner } from '~/v4/social/internal-components/Spinner/SpinnerWhite';
import { isAmityFile } from '~/v4/utils/checkFileType';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Mode } from '~/v4/social/pages/PostComposerPage';
import styles from './DraftClipPage.module.css';

type DraftClipPageProps = {
  targetId: string | null;
  targetType: 'community' | 'user';
  community?: Amity.Community;
};

export const DraftClipPage = ({ targetId, targetType, community }: DraftClipPageProps) => {
  const pageId = 'draft_clip_page';
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { file, isMuted, isAspectFill, setFile, setIsMuted, setIsAspectFill, setClipThumbnail } =
    useClipContext();
  const { files, isLoading, videoThumbnail, uploadFile } = useFilePostUpload(pageId);

  const { confirm, info } = useConfirmContext();
  const { onBack } = useNavigation();

  const { AmityDraftClipPageBehavior } = usePageBehavior();

  const discardCreateStory = () => {
    confirm({
      pageId,
      title: useString('amity_social_modal_dialog_title_discard_clip'),
      content: useString('amity_social_modal_dialog_discard_clip'),
      cancelText: useString('amity_social_button_keep_editing'),
      okText: useString('amity_social_button_discard'),
      onOk: () => {
        setFile(null);
        onBack();
      },
    });
  };

  useEffect(() => {
    if (file) {
      uploadFile([file as File], FileType.CLIP);
    }
  }, []);

  const isUploadedFile = !isLoading && files.length > 0 && isAmityFile(files[0].file);

  if (isUploadedFile) {
    setFile(files[0].file);
    setClipThumbnail(videoThumbnail[0]?.thumbnail || null);
  }

  useEffect(() => {
    if (files.some((f) => f.status === 'failed')) {
      info({
        pageId,
        title: resolveString('amity_social_modal_dialog_title_max_file_size_limit'),
        content: resolveString('amity_social_modal_dialog_video_upload_error'),
        okText: resolveString('amity_social_button_ok'),
        onOk: () => {
          onBack();
        },
      });
    }
  }, [files]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div style={themeStyles} className={styles.draftClipPage} data-testid={accessibilityId}>
      <div className={styles.draftClipPage__headerContainer}>
        <RoundedBackButton
          pageId={pageId}
          onPress={discardCreateStory}
          defaultClassName={styles.draftClipPage__backButton}
        />
        {isUploadedFile && (
          <div className={styles.draftClipPage__headerRight}>
            <MuteButton
              isMuted={isMuted}
              pageId={pageId}
              handleMuteToggle={handleMuteToggle}
              isLocalMuted={isMuted}
              enableMuteToggle={true}
            />
            <AspectRatioButton
              pageId={pageId}
              onPress={() => setIsAspectFill(!isAspectFill)}
              defaultIconClassName={styles.draftClipPage__aspectRatioButtonIcon}
            />
          </div>
        )}
      </div>
      {isLoading && (
        <div className={styles.draftClipPage__loadingContainer}>
          <img
            src={videoThumbnail[0]?.thumbnail}
            alt="Loading..."
            className={styles.draftClipPage__loadingThumbnail}
          />
          <Spinner className={styles.draftClipPage__spinner} />
        </div>
      )}

      {isUploadedFile && (
        <video
          data-isaspect-fill={isAspectFill}
          className={styles.draftClipPage__videoPreview}
          src={
            isAmityFile(files[0].file) ? files[0].file.fileUrl : URL.createObjectURL(file as File)
          }
          autoPlay
          loop
          muted={isMuted}
          controls={false}
          playsInline
        />
      )}

      {isUploadedFile && (
        <NextButton
          pageId={pageId}
          onPress={() => {
            AmityDraftClipPageBehavior?.goToPostComposerPage?.({
              mode: Mode.CREATE,
              targetId,
              targetType,
              isClipPost: true,
              community,
            });
          }}
          buttonClassName={styles.draftClipPage__nextButton}
        />
      )}
    </div>
  );
};
