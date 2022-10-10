import { ELEMENT_MENTION } from '@udecode/plate';
import { MentionData, MentionItem, MentionType } from './models';
import { MentionElement, Text } from '../../models';
import { MentionSymbol, MentionRegex } from './constants';

export function toMentionItem(data: MentionData): MentionItem {
  return {
    data,
    key: data.id,
    text: data.display,
  };
}

export function fromMentionItem(item: MentionItem): MentionData {
  return item.data;
}

export function mentionElementToStringWithTags(element: MentionElement) {
  return `${MentionSymbol[element.mentionType]}[${element.value}](${element.id})`;
}

export function mentionElementToStringWithoutTags(element: MentionElement) {
  return `${MentionSymbol[element.mentionType]}${element.value}`;
}

export function stripMentionTags(text: string) {
  return text.replaceAll(MentionRegex, '$1$2');
}

/** Obfuscate mention tags so the serializer does not turn them to links */
export function obfuscateMentionTags(text: string) {
  return text.replaceAll(MentionRegex, '$1($2)($3)');
}

/** Break text nodes with mention tags into mention elements */
export function breakTextNodeIntoMentions(
  textNode: Text,
  mentionWithTagsRegex: RegExp,
): Text | (Text | MentionElement)[] {
  if (!mentionWithTagsRegex.test(textNode.text)) {
    return textNode;
  }

  const nodes: (Text | MentionElement)[] = [];
  let currentIndex = 0;

  const matches = [...textNode.text.matchAll(new RegExp(mentionWithTagsRegex, 'g'))];
  matches.forEach((match) => {
    const matchIndex = textNode.text.indexOf(match[0]);
    nodes.push({ text: textNode.text.substring(currentIndex, matchIndex) });
    nodes.push({
      children: [{ text: '' }],
      type: ELEMENT_MENTION,
      mentionType: Object.keys(MentionSymbol).find(
        (key) => MentionSymbol[key] === match[1],
      ) as MentionType,
      value: match[2],
      id: match[3],
    });
    currentIndex = matchIndex + match[0].length;
  });

  nodes.push({ text: textNode.text.substring(currentIndex) });

  return nodes;
}
