export const DEBOUNCE_PREVIEW_LINK = 2000;

export const MAX_LINKS_PER_POST = 100;

export const URL_REGEX =
  /(?<![\w])(?:(?:https?|ftp):\/\/(?:[a-zA-Z0-9.-]+|[\d.]+)(?::\d{1,5})?(?:\/(?:[^\s<>|()]*(?:\([^\s<>|()]*\)[^\s<>|()]*)*)*)?|mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|www\.(?:[a-zA-Z0-9.-]+)(?:\/(?:[^\s<>|()]*(?:\([^\s<>|()]*\)[^\s<>|()]*)*)*)?)?(?=[.,;]?\s|[.,;]?$|$)/g;
