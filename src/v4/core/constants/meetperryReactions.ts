const emojiDataUrl = (emoji: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text x="16" y="24" text-anchor="middle" font-size="26">${emoji}</text></svg>`,
  )}`;

export const MEETPERRY_REACTIONS: { name: string; image: string }[] = [
  { name: 'like', image: emojiDataUrl('👍') },
  { name: 'love', image: emojiDataUrl('❤️') },
  { name: 'haha', image: emojiDataUrl('😂') },
  { name: 'bullish', image: emojiDataUrl('🚀') },
  { name: 'curious', image: emojiDataUrl('👀') },
  { name: 'support', image: emojiDataUrl('🙏') },
  { name: 'insightful', image: emojiDataUrl('💡') },
  { name: 'celebrate', image: emojiDataUrl('👏') },
];

export const MEETPERRY_DEFAULT_REACTION = 'like';

// Display-only fallbacks for reactions stored under the kit's previous names.
// These are NOT offered in the picker — they only render existing reaction
// records correctly instead of showing the question-mark FallbackReaction icon.
export const MEETPERRY_LEGACY_REACTIONS: { name: string; image: string }[] = [
  { name: 'fire', image: emojiDataUrl('🔥') },
  { name: 'happy', image: emojiDataUrl('😀') },
  { name: 'sad', image: emojiDataUrl('😢') },
  { name: 'heart', image: emojiDataUrl('❤️') },
  { name: 'grinning', image: emojiDataUrl('😀') },
  { name: 'crying', image: emojiDataUrl('😢') },
];

export const withLegacyReactions = (
  pickerReactions: { name: string; image: string }[],
): { name: string; image: string }[] => {
  const pickerNames = new Set(pickerReactions.map((r) => r.name));
  return [
    ...pickerReactions,
    ...MEETPERRY_LEGACY_REACTIONS.filter((r) => !pickerNames.has(r.name)),
  ];
};
