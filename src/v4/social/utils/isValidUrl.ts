import { URL_REGEX } from '~/v4/social/constants/post';

export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  const regex = new RegExp(`^${URL_REGEX.source}$`);
  return regex.test(url);
};
