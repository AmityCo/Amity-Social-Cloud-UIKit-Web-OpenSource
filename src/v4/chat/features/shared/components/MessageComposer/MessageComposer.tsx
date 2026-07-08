import { useRef, useState } from 'react';
import { TextEditor, type TextEditorHandle } from '~/v4/core/components/TextEditor/TextEditor';
import { COMPOSER_TEXT_MAX_LENGTH } from '~/v4/chat/constants';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Plus } from '~/v4/icons/Plus';
import Close from '~/v4/icons/Close';
import ArrowTop from '~/v4/icons/ArrowTop';
import { useString } from '~/v4/core/localization';
import { MediaSection } from './components/MediaSection/MediaSection';
import { MessageReplyBand } from '~/v4/chat/features/shared/components/MessageReplyBand';
import type { useMessageComposer } from '~/v4/chat/features/shared/hooks/useMessageComposer';
import styles from './MessageComposer.module.css';

type MessageComposer = ReturnType<typeof useMessageComposer>;

type MessageComposerProps = {
  composer: MessageComposer;
  onOpenSeeMore: (text: string, title?: string) => void;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
};

const MAX_MENTIONS = 30;

export function MessageComposer({
  composer,
  onOpenSeeMore,
  onOpenImage,
  onOpenVideo,
}: MessageComposerProps) {
  const {
    subChannelId,
    enableMention,
    text,
    setText,
    canSend,
    isEditing,
    editingMessageId,
    originalText,
    editingMentions,
    editorMentions,
    setEditorMentions,
    cancelEdit,
    replyTo,
    cancelReply,
    showMediaSection,
    toggleMediaSection,
    collapseMediaSection,
    handleSendText,
    handleSelectMedia,
  } = composer;

  const editorRef = useRef<TextEditorHandle | null>(null);
  const [mentionSlot, setMentionSlot] = useState<HTMLDivElement | null>(null);
  const editingMessageLabel = useString('amity_chat_editing_message');
  const composerPlaceholder = useString('amity_chat_composer_placeholder');
  const mentionLimitTitle = useString('amity_chat_reach_mention_limit_title');
  const mentionLimitMessage = useString('amity_chat_reach_mention_limit_message');

  function onToggle() {
    if (!showMediaSection) {
      editorRef.current?.blur();
    } else {
      editorRef.current?.focus();
    }
    toggleMediaSection();
  }

  async function onSend() {
    if (!canSend) return;
    if (!isEditing) {
      editorRef.current?.clear();
    }
    await handleSendText();
  }

  function onTextChanged(value: string) {
    setText(value);
    if (value.length > 0 && showMediaSection) {
      collapseMediaSection();
    }
  }

  return (
    <div className={styles.messageComposer}>
      {enableMention ? (
        <div
          ref={setMentionSlot}
          className={styles.messageComposer__mentionSlot}
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
        />
      ) : null}
      {isEditing ? (
        <div className={styles.messageComposer__editPanel}>
          <Typography.CaptionBold className={styles.messageComposer__editPanelTitle}>
            {editingMessageLabel}
          </Typography.CaptionBold>
          <button
            type="button"
            className={styles.messageComposer__editPanelClose}
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={cancelEdit}
            aria-label="Cancel edit"
          >
            <Close className={styles.messageComposer__editPanelCloseIcon} />
          </button>
        </div>
      ) : null}

      {!isEditing && replyTo ? (
        <MessageReplyBand
          replyTo={replyTo}
          onCancel={cancelReply}
          onOpenSeeMore={onOpenSeeMore}
          onOpenImage={onOpenImage}
          onOpenVideo={onOpenVideo}
        />
      ) : null}

      <div className={styles.messageComposer__inputRow}>
        {isEditing ? null : (
          <button
            type="button"
            className={styles.messageComposer__iconButton}
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={onToggle}
            aria-label="Attach media"
            aria-expanded={showMediaSection}
          >
            {showMediaSection ? (
              <Close className={styles.messageComposer__icon} />
            ) : (
              <Plus className={styles.messageComposer__icon} />
            )}
          </button>
        )}

        <div className={styles.messageComposer__inputWrapper}>
          {enableMention ? (
            <TextEditor
              key={editingMessageId ?? 'create'}
              ref={editorRef}
              editorContentType="message"
              channelId={subChannelId}
              enableMention
              suggestionDisplayMode="bottom"
              maxMentions={MAX_MENTIONS}
              mentionLimitTitle={mentionLimitTitle}
              mentionLimitMessage={mentionLimitMessage}
              mentionPortalContainer={mentionSlot}
              placeholder={composerPlaceholder}
              minLines={1}
              maxLines={4}
              maxCharacters={COMPOSER_TEXT_MAX_LENGTH}
              initialText={isEditing ? originalText : text || undefined}
              initialMentions={isEditing ? editingMentions : editorMentions}
              autoFocus={isEditing}
              onTextChanged={onTextChanged}
              onMentionsChanged={setEditorMentions}
              className={styles.messageComposer__editor}
              placeholderClassName={styles.messageComposer__placeholder}
            />
          ) : (
            <TextEditor
              key={editingMessageId ?? 'create'}
              ref={editorRef}
              editorContentType="message"
              enableMention={false}
              placeholder={composerPlaceholder}
              minLines={1}
              maxLines={4}
              maxCharacters={COMPOSER_TEXT_MAX_LENGTH}
              initialText={isEditing ? originalText : text || undefined}
              autoFocus={isEditing}
              onTextChanged={onTextChanged}
              className={styles.messageComposer__editor}
              placeholderClassName={styles.messageComposer__placeholder}
            />
          )}
        </div>

        {showMediaSection ? null : (
          <button
            type="button"
            className={styles.messageComposer__sendButton}
            data-enabled={canSend ? 'true' : 'false'}
            disabled={!canSend}
            onMouseDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onClick={onSend}
            aria-label="Send message"
          >
            <ArrowTop className={styles.messageComposer__sendIcon} />
          </button>
        )}
      </div>

      {!isEditing && showMediaSection ? <MediaSection onPickFile={handleSelectMedia} /> : null}
    </div>
  );
}
