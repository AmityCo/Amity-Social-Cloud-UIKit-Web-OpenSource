import { ObfuscatedMentionRegex } from './constants';
import { breakTextNodeIntoMentions, obfuscateMentionTags } from './utils';

const textNodeWithoutMention = { text: 'hello there' };
const textNodeWithOneMention = { text: obfuscateMentionTags('hello there @[Sam](SAM123)') };
const textNodeWithTwoMentions = {
  text: obfuscateMentionTags('hello there @[Sam](SAM123) and @[Jessica](JESS123)!'),
};

describe('mention utils', () => {
  test('should not transform a node without mentions', () => {
    expect(breakTextNodeIntoMentions(textNodeWithoutMention, ObfuscatedMentionRegex)).toEqual(
      textNodeWithoutMention,
    );
  });

  test('should transform a node with a mention', () => {
    expect(breakTextNodeIntoMentions(textNodeWithOneMention, ObfuscatedMentionRegex)).toEqual([
      { text: 'hello there ' },
      {
        children: [{ text: '' }],
        type: 'mention',
        mentionType: 'user',
        value: 'Sam',
        id: 'SAM123',
      },
      { text: '' },
    ]);
  });

  test('should transform a node with two mentions', () => {
    expect(breakTextNodeIntoMentions(textNodeWithTwoMentions, ObfuscatedMentionRegex)).toEqual([
      { text: 'hello there ' },
      {
        children: [{ text: '' }],
        type: 'mention',
        mentionType: 'user',
        value: 'Sam',
        id: 'SAM123',
      },
      { text: ' and ' },
      {
        children: [{ text: '' }],
        type: 'mention',
        mentionType: 'user',
        value: 'Jessica',
        id: 'JESS123',
      },
      { text: '!' },
    ]);
  });
});
