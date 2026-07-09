export const ERROR_RESPONSE = Object.freeze({
  IMAGE_NUDITY: 'Amity SDK (500000): Image uploading failed: Nudity content is not permitted',
  INVALID_IMAGE: 'Amity SDK (500000): Image uploading failed: Request has invalid image format',
  DELETED_POST: '400400',
  DELETED_COMMENT: '400400',
  POLL_CLOSED: '400000',
  POLL_NOT_FOUND: 'Poll not found',
  UNAVAILABLE: '500000',
  BLOCKED_WORD: '400308',
  BLOCKED_URL: '400309',
  NOT_FOLLOWING_USER: 'You are not following this user',
  GLOBAL_BAN: '400312',
});

export const ERROR_CODE = {
  BLOCKED_WORD: '400308',
  BLOCKED_URL: '400309',
  VIOLENT_CONTENT: '400314',
  IMAGE_NUDITY: '500000',
  ONLY_ONE_MODERATOR: '400317',
  ONLY_ONE_MEMBER: '400318',
  DISABLED_PRODUCT_TAG: '400302',
  VISITOR_USAGE_LIMIT: '400323',
};
