import { URL_REGEX } from '~/v4/social/constants/post';

export const extractLinks = (text: string): Amity.Link[] => {
  const links: Amity.Link[] = [];
  const matches = text.matchAll(URL_REGEX);

  for (const match of matches) {
    if (match.index !== undefined && match[0]) {
      const url = match[0].trim();
      if (url.length > 0) {
        links.push({
          index: match.index,
          length: url.length,
          url,
          renderPreview: true,
        });
      }
    }
  }

  return links;
};
