import { ERROR_CODE, ERROR_RESPONSE } from '~/v4/chat/constants';
import { resolveString } from '~/v4/core/localization';

type Notify = {
  errorToast: (args: { content: string }) => void;
  info: (args: { title: string; content: string; okText?: string }) => void;
};

function isBanWordError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes(ERROR_CODE.BLOCKED_WORD) ||
      error.message.includes(ERROR_RESPONSE.CONTAIN_BLOCKED_WORD))
  );
}

function isLinkNotAllowedError(error: unknown): boolean {
  return (
    error instanceof Error && error.message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)
  );
}

function isMessageTooLongError(error: unknown): boolean {
  return error instanceof Error && error.message.includes(ERROR_CODE.MESSAGE_TOO_LONG);
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message.includes(ERROR_CODE.NOT_FOUND);
}

export function handleTextMessageError(error: unknown, notify: Notify): void {
  if (isBanWordError(error)) {
    notify.errorToast({ content: resolveString('amity_chat_toast_banned_word') });
    return;
  }
  if (isLinkNotAllowedError(error)) {
    notify.errorToast({ content: resolveString('amity_chat_toast_link_not_allow') });
    return;
  }
  if (isMessageTooLongError(error)) {
    notify.info({
      title: resolveString('amity_chat_char_limit_alert_title'),
      content: resolveString('amity_chat_char_limit_alert_message'),
      okText: resolveString('amity_social_button_done'),
    });
    return;
  }
  if (isNotFoundError(error)) {
    notify.errorToast({ content: resolveString('amity_chat_toast_reply_parent_deleted') });
  }
}
