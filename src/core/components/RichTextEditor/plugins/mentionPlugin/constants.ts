import { MentionType } from './models';

export const MentionSymbol: Record<MentionType, string> = {
  user: '@',
  tag: '#',
};

export const MentionRegex = new RegExp(
  `([${Object.values(MentionSymbol).join(
    ',',
  )}])\\[([\\p{L}\\p{M}\\p{N}_\\-\\s]+)\\]\\(([A-Za-z0-9]+)\\)`,
  'gu',
);

export const ObfuscatedMentionRegex = new RegExp(
  `([${Object.values(MentionSymbol).join(
    ',',
  )}])\\(([\\p{L}\\p{M}\\p{N}_\\-\\s]+)\\)\\(([A-Za-z0-9]+)\\)`,
  'gu',
);
