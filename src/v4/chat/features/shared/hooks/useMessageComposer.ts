import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNetworkState } from 'react-use';
import { FileRepository, MessageRepository } from '@amityco/ts-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { COMPOSER_MAX_FILE_SIZE, ERROR_CODE, ERROR_RESPONSE } from '~/v4/chat/constants';
import { resolveString, useString } from '~/v4/core/localization';

import { handleTextMessageError } from '~/v4/chat/utils/handleTextMessageError';
import { useEditMessageQuery } from '~/v4/chat/hooks/queries';
import type { Mentioned, Mentionees } from '~/v4/helpers/utils';

type CreateMessageParams = Parameters<typeof MessageRepository.createMessage>[0];

type CreateMessageResponse = Awaited<ReturnType<typeof MessageRepository.createMessage>>;

export type FailureReason = 'moderation' | 'generic' | 'cancelled';

export type PendingUpload = {
  clientId: string;
  dataType: 'image' | 'video';
  file: File;
  previewUrl: string;
  status: 'uploading' | 'failed';
  error?: Error;
  fileId?: string;
  createdAt: string;
  failureReason?: FailureReason;
  parentId?: string;
};

export type PendingText = {
  clientId: string;
  text: string;
  parentId?: string;
  metadata?: { mentioned: Mentioned[] };
  mentionees?: Mentionees;
  status: 'failed';
  failureReason?: FailureReason;
  createdAt: string;
};

export type SyntheticPendingMessage = Amity.Message & {
  __syntheticClientId: string;
  __failureReason?: FailureReason;
};

export function isSyntheticPendingMessage(
  message: Amity.Message,
): message is SyntheticPendingMessage {
  return typeof (message as Partial<SyntheticPendingMessage>).__syntheticClientId === 'string';
}

type UseMessageComposerParams = {
  subChannelId: string;
  enableMention?: boolean;
  editingMessage?: Amity.Message | null;
  onMessageCreated?: () => void;
  onEditCompleted?: () => void;
};

function createClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toFormData(file: File): FormData {
  const formData = new FormData();
  formData.append('files', file);
  return formData;
}

function buildPendingText(
  text: string,
  failureReason: FailureReason,
  options: { parentId?: string; metadata?: PendingText['metadata']; mentionees?: Mentionees },
): PendingText {
  return {
    clientId: createClientId(),
    text,
    ...(options.parentId ? { parentId: options.parentId } : {}),
    ...(options.metadata ? { metadata: options.metadata } : {}),
    ...(options.mentionees ? { mentionees: options.mentionees } : {}),
    status: 'failed',
    failureReason,
    createdAt: new Date().toISOString(),
  };
}

function isLinkNotAllowedError(error: unknown): boolean {
  return (
    error instanceof Error && error.message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)
  );
}

function isModerationError(error: unknown): boolean {
  return error instanceof Error && error.message.includes(ERROR_CODE.IMAGE_NUDITY);
}

function classifyMediaError(error: unknown): FailureReason {
  if (isModerationError(error)) return 'moderation';
  return 'generic';
}

export function useMessageComposer({
  subChannelId,
  enableMention = false,
  editingMessage = null,
  onMessageCreated,
  onEditCompleted,
}: UseMessageComposerParams) {
  const { error: errorToast } = useNotifications('chat');
  const { info } = useConfirmContext();
  const queryClient = useQueryClient();
  const { currentUserId } = useSDK();
  const { online } = useNetworkState();
  const isOnline = online !== false;
  const { requestEdit } = useEditMessageQuery();
  const linkNotAllowedToast = useString('amity_chat_toast_link_not_allow');

  const [text, setText] = useState<string>('');
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [pendingTexts, setPendingTexts] = useState<PendingText[]>([]);
  const [editorMentions, setEditorMentions] = useState<Mentioned[]>([]);
  const [replyTo, setReplyTo] = useState<Amity.Message | null>(null);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const cancelledClientIdsRef = useRef<Set<string>>(new Set());
  const retryingClientIdsRef = useRef<Set<string>>(new Set());
  const textRef = useRef<string>('');
  const mentionsRef = useRef<Mentioned[]>([]);
  const wasEditingRef = useRef<boolean>(false);

  const isEditing = editingMessage != null;
  const editingMessageId = editingMessage?.messageId ?? null;
  const originalText = useMemo(() => {
    if (!editingMessage) return '';
    return ((editingMessage.data as { text?: string } | undefined)?.text ?? '').toString();
  }, [editingMessage]);

  const editingMentionsMeta = editingMessage?.metadata as { mentioned?: Mentioned[] } | undefined;
  const editingMentions: Mentioned[] = editingMentionsMeta?.mentioned ?? [];

  useEffect(() => {
    if (editingMessage) {
      if (!wasEditingRef.current) {
        textRef.current = text;
        mentionsRef.current = editorMentions;
      }
      setText(originalText);
      setEditorMentions(editingMentionsMeta?.mentioned ?? []);
      setShowMediaSection(false);
      setReplyTo(null);
    }
    wasEditingRef.current = !!editingMessage;
  }, [editingMessage, originalText, editingMentionsMeta]);

  const trimmedText = text.trim();
  const trimmedOriginal = originalText.trim();
  const canSend = isEditing
    ? trimmedText.length > 0 && trimmedText !== trimmedOriginal
    : trimmedText.length > 0;

  useEffect(() => {
    const urls = previewUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const { mutateAsync: createMessageMutation } = useMutation<
    CreateMessageResponse,
    Error,
    CreateMessageParams
  >({
    mutationFn: MessageRepository.createMessage,
  });

  function handleMediaError(err: unknown) {
    if (isLinkNotAllowedError(err)) {
      errorToast({ content: linkNotAllowedToast });
    }
  }

  const toggleMediaSection = useCallback(() => {
    setShowMediaSection((prev) => !prev);
  }, []);

  const collapseMediaSection = useCallback(() => {
    setShowMediaSection(false);
  }, []);

  const handleSendText = useCallback(async () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;

    const activeMentions = enableMention ? editorMentions : [];
    const mentionees = buildMentionees(activeMentions);
    const metadata = activeMentions.length > 0 ? { mentioned: activeMentions } : undefined;

    if (isEditing && editingMessage) {
      if (trimmed === originalText.trim()) return;
      await requestEdit(editingMessage, trimmed, {
        metadata,
        mentionees,
        onSuccess: () => {
          setText('');
          setEditorMentions([]);
          textRef.current = '';
          mentionsRef.current = [];
          onEditCompleted?.();
        },
      });
      return;
    }

    const parentId = replyTo?.messageId;
    setText('');
    setEditorMentions([]);
    setShowMediaSection(false);
    setReplyTo(null);

    if (!isOnline) {
      const pending = buildPendingText(trimmed, 'generic', { parentId, metadata, mentionees });
      setPendingTexts((prev) => [...prev, pending]);
      onMessageCreated?.();
      return;
    }

    await createMessageMutation(
      {
        subChannelId,
        dataType: 'text',
        data: { text: trimmed },
        metadata,
        mentionees,
        ...(parentId ? { parentId } : {}),
      },
      {
        onSuccess: () => {
          onMessageCreated?.();
        },
        onError: (err) => {
          handleTextMessageError(err, { errorToast, info });
        },
      },
    );
  }, [
    text,
    enableMention,
    editorMentions,
    replyTo,
    isEditing,
    editingMessage,
    originalText,
    requestEdit,
    onEditCompleted,
    subChannelId,
    isOnline,
    createMessageMutation,
    onMessageCreated,
    errorToast,
    info,
  ]);

  const cancelEdit = useCallback(() => {
    setText(textRef.current);
    setEditorMentions(mentionsRef.current);
    textRef.current = '';
    mentionsRef.current = [];
    onEditCompleted?.();
  }, [onEditCompleted]);

  const startReply = useCallback(
    (message: Amity.Message) => {
      if (isEditing) {
        cancelEdit();
      }
      setReplyTo(message);
    },
    [isEditing, cancelEdit],
  );

  const cancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const runMediaUpload = useCallback(
    async (pending: PendingUpload) => {
      try {
        const formData = toFormData(pending.file);
        const uploaded =
          pending.dataType === 'image'
            ? await FileRepository.uploadImage(formData)
            : await FileRepository.uploadVideo(formData, 'message');

        if (cancelledClientIdsRef.current.has(pending.clientId)) {
          cancelledClientIdsRef.current.delete(pending.clientId);
          return;
        }

        const fileId = uploaded?.data?.[0]?.fileId;
        if (!fileId) throw new Error('Upload did not return a fileId.');

        queryClient.setQueryData(['asc-uikit', 'FileRepository', 'getFile', fileId], {
          data: uploaded.data[0],
        });

        flushSync(() => {
          setPendingUploads((prev) =>
            prev.map((p) => (p.clientId === pending.clientId ? { ...p, fileId } : p)),
          );
        });

        await createMessageMutation({
          subChannelId,
          dataType: pending.dataType,
          fileId,
          ...(pending.parentId ? { parentId: pending.parentId } : {}),
        });
      } catch (err) {
        if (cancelledClientIdsRef.current.has(pending.clientId)) {
          cancelledClientIdsRef.current.delete(pending.clientId);
          return;
        }
        const failureReason = classifyMediaError(err);
        setPendingUploads((prev) =>
          prev.map((p) =>
            p.clientId === pending.clientId
              ? {
                  ...p,
                  status: 'failed',
                  error: err instanceof Error ? err : new Error(String(err)),
                  failureReason,
                }
              : p,
          ),
        );
        handleMediaError(err);
      }
    },
    [subChannelId, createMessageMutation, queryClient],
  );

  const handleSelectMedia = useCallback(
    async (file: File) => {
      if (!file) return;
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) return;

      if (file.size > COMPOSER_MAX_FILE_SIZE) {
        errorToast({ content: resolveString('amity_social_label_file_exceeds_max_upload') });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      const parentId = replyTo?.messageId;
      const pending: PendingUpload = {
        clientId: createClientId(),
        dataType: isImage ? 'image' : 'video',
        file,
        previewUrl,
        status: 'uploading',
        createdAt: new Date().toISOString(),
        ...(parentId ? { parentId } : {}),
      };

      setPendingUploads((prev) => [...prev, pending]);
      setShowMediaSection(false);
      setReplyTo(null);
      onMessageCreated?.();

      await runMediaUpload(pending);
    },
    [errorToast, runMediaUpload, onMessageCreated, replyTo],
  );

  const handleRetryUpload = useCallback(
    async (clientId: string) => {
      const target = pendingUploads.find((p) => p.clientId === clientId);
      if (!target) return;
      cancelledClientIdsRef.current.delete(clientId);
      setPendingUploads((prev) =>
        prev.map((p) =>
          p.clientId === clientId ? { ...p, status: 'uploading', error: undefined } : p,
        ),
      );
      await runMediaUpload({ ...target, status: 'uploading', error: undefined });
    },
    [pendingUploads, runMediaUpload],
  );

  const handleRetryText = useCallback(
    async (clientId: string) => {
      const target = pendingTexts.find((p) => p.clientId === clientId);
      if (!target) return;
      if (retryingClientIdsRef.current.has(clientId)) return;
      retryingClientIdsRef.current.add(clientId);
      try {
        await createMessageMutation({
          subChannelId,
          dataType: 'text',
          data: { text: target.text },
          ...(target.metadata ? { metadata: target.metadata } : {}),
          ...(target.mentionees ? { mentionees: target.mentionees } : {}),
          ...(target.parentId ? { parentId: target.parentId } : {}),
        });
        setPendingTexts((prev) => prev.filter((p) => p.clientId !== clientId));
        onMessageCreated?.();
      } catch (err) {
        handleTextMessageError(err, { errorToast, info });
      } finally {
        retryingClientIdsRef.current.delete(clientId);
      }
    },
    [pendingTexts, subChannelId, createMessageMutation, onMessageCreated, errorToast, info],
  );

  const handleDiscardText = useCallback((clientId: string) => {
    setPendingTexts((prev) => prev.filter((p) => p.clientId !== clientId));
  }, []);

  function handleCancelUpload(clientId: string) {
    cancelledClientIdsRef.current.add(clientId);
    setPendingUploads((prev) =>
      prev.map((p) =>
        p.clientId === clientId ? { ...p, status: 'failed', failureReason: 'cancelled' } : p,
      ),
    );
  }

  const handleDiscardUpload = useCallback((clientId: string) => {
    cancelledClientIdsRef.current.add(clientId);
    setPendingUploads((prev) => {
      const target = prev.find((p) => p.clientId === clientId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrlsRef.current.delete(target.previewUrl);
      }
      return prev.filter((p) => p.clientId !== clientId);
    });
  }, []);

  const handleMediaLoaded = useCallback((fileId: string) => {
    setPendingUploads((prev) => {
      const target = prev.find((p) => p.fileId === fileId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrlsRef.current.delete(target.previewUrl);
      }
      return prev.filter((p) => p.fileId !== fileId);
    });
  }, []);

  const syntheticMessages = useMemo<SyntheticPendingMessage[]>(() => {
    const media = pendingUploads
      .filter((p) => !p.fileId)
      .map(
        (p) =>
          ({
            __syntheticClientId: p.clientId,
            __failureReason: p.failureReason,
            messageId: '',
            subChannelId,
            creatorId: currentUserId ?? '',
            dataType: p.dataType,
            data: {},
            syncState: (p.status === 'failed' ? 'error' : 'syncing') as Amity.SyncState,
            createdAt: p.createdAt,
            isDeleted: false,
          }) as unknown as SyntheticPendingMessage,
      );

    const texts = pendingTexts.map(
      (p) =>
        ({
          __syntheticClientId: p.clientId,
          __failureReason: p.failureReason,
          messageId: '',
          subChannelId,
          creatorId: currentUserId ?? '',
          dataType: 'text',
          data: { text: p.text },
          metadata: p.metadata,
          parentId: p.parentId,
          syncState: 'error' as Amity.SyncState,
          createdAt: p.createdAt,
          isDeleted: false,
        }) as unknown as SyntheticPendingMessage,
    );

    return [...media, ...texts].sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return at - bt;
    });
  }, [pendingUploads, pendingTexts, subChannelId, currentUserId]);

  return {
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
    startReply,
    cancelReply,
    showMediaSection,
    toggleMediaSection,
    collapseMediaSection,
    pendingUploads,
    syntheticMessages,
    handleSendText,
    handleSelectMedia,
    handleRetryUpload,
    handleCancelUpload,
    handleDiscardUpload,
    handleRetryText,
    handleDiscardText,
    handleMediaLoaded,
  };
}

function buildMentionees(mentions: Mentioned[]): Mentionees | undefined {
  if (mentions.length === 0) return undefined;

  const userIds = Array.from(
    new Set(
      mentions
        .filter((m): m is Mentioned & { userId: string } => m.type === 'user' && !!m.userId)
        .map((m) => m.userId),
    ),
  );
  const hasChannelMention = mentions.some((m) => m.type === 'channel');

  const out: Mentionees = [];
  if (userIds.length > 0) {
    out.push({ type: 'user', userIds } as Amity.UserMention);
  }
  if (hasChannelMention) {
    out.push({ type: 'channel' } as Amity.ChannelMention);
  }
  return out.length > 0 ? out : undefined;
}
