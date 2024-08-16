import { SerializedParagraphNode, SerializedRootNode, SerializedTextNode } from 'lexical';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { SerializedMentionNode } from '~/v4/social/internal-components/MentionTextInput/MentionNodes';

function createRootNode(): SerializedRootNode<SerializedParagraphNode> {
  return {
    children: [],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  };
}
function createParagraphNode(): SerializedParagraphNode {
  return {
    children: [],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
  };
}

function createSerializeTextNode(text: string): SerializedTextNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  };
}

function createSerializeMentionNode(mention: Mentioned): SerializedMentionNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: ('@' + mention.userId) as string,
    type: 'mention',
    version: 1,
    mentionName: mention.userId as string,
    displayName: mention.userId as string,
    userId: mention.userId as string,
    userInternalId: mention.userId as string,
    userPublicId: mention.userId as string,
  };
}

export function textToEditorState(value: {
  data: { text: string };
  metadata?: {
    mentioned?: Mentioned[];
  };
  mentionees?: Mentionees;
}) {
  const rootNode = createRootNode();
  const textArray = value.data.text.split('\n');
  const mentions = value.metadata?.mentioned || [];
  let mentionIndex = 0;
  let globalIndex = 0;

  for (let i = 0; i < textArray.length; i++) {
    const paragraph = createParagraphNode();
    let runningIndex = 0;

    while (runningIndex < textArray[i].length) {
      if (mentionIndex < mentions.length && mentions[mentionIndex].index === globalIndex) {
        paragraph.children.push(createSerializeMentionNode(mentions[mentionIndex]));
        runningIndex += mentions[mentionIndex].length;
        globalIndex += mentions[mentionIndex].length;
        mentionIndex++;
      } else {
        const nextMentionIndex =
          mentionIndex < mentions.length
            ? mentions[mentionIndex].index
            : globalIndex + textArray[i].length;
        const textSegment = textArray[i].slice(
          runningIndex,
          nextMentionIndex - globalIndex + runningIndex,
        );
        if (textSegment) {
          paragraph.children.push(createSerializeTextNode(textSegment));
        }
        runningIndex += textSegment.length;
        globalIndex += textSegment.length;
      }
    }

    if (runningIndex < textArray[i].length) {
      const textSegment = textArray[i].slice(runningIndex);
      if (textSegment) {
        paragraph.children.push(createSerializeTextNode(textSegment));
      }
      globalIndex += textSegment.length;
    }

    globalIndex += 1;

    rootNode.children.push(paragraph);
  }

  return { root: rootNode };
}
