import { MentionType } from './models';

export const MentionSymbol: Record<MentionType, string> = {
  user: '@',
  tag: '#',
};

export const MentionRegex = new RegExp(
  `([${Object.values(MentionSymbol).join(
    ',',
  )}])\\[([A-Za-z0-9\\_\\-\\s]+)\\]\\(([A-Za-z0-9\\_\\-\\s]+)\\)`,
);

export const ObfuscatedMentionRegex = new RegExp(
  `([${Object.values(MentionSymbol).join(
    ',',
  )}])\\(([A-Za-z0-9\\_\\-\\s]+)\\)\\(([A-Za-z0-9\\_\\-\\s]+)\\)`,
);
