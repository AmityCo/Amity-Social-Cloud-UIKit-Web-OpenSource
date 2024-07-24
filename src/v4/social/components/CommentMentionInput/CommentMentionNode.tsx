import type { Spread } from 'lexical';

import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    displayName?: string;
    userId?: string;
    userInternalId?: string;
    userPublicId?: string;
    type: 'mention';
    version: 1;
  },
  SerializedTextNode
>;

function convertMentionElement(domNode: HTMLElement): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode({ mentionName: textContent });
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = `color: var(--asc-color-primary-default)`;

export class MentionNode extends TextNode {
  __mention: string;
  __displayName: string | undefined;
  __userId: string | undefined;
  __userInternalId: string | undefined;
  __userPublicId: string | undefined;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode({
      mentionName: node.__mention,
      displayName: node.__displayName,
      userId: node.__userId,
      userInternalId: node.__userInternalId,
      userPublicId: node.__userPublicId,
      text: node.__text,
      key: node.__key,
    });
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode({
      mentionName: serializedNode.mentionName,
      displayName: serializedNode.displayName,
      userId: serializedNode.userId,
      userInternalId: serializedNode.userInternalId,
      userPublicId: serializedNode.userPublicId,
    });
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor({
    mentionName,
    displayName,
    userId,
    userInternalId,
    userPublicId,
    text,
    key,
  }: {
    mentionName: string;
    text?: string;
    key?: NodeKey;
    displayName?: string;
    userId?: string;
    userInternalId?: string;
    userPublicId?: string;
  }) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    this.__displayName = displayName;
    this.__userId = userId;
    this.__userInternalId = userInternalId;
    this.__userPublicId = userPublicId;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      displayName: this.__displayName,
      userId: this.__userId,
      userInternalId: this.__userInternalId,
      userPublicId: this.__userPublicId,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle; //class name css
    dom.className = 'mention'; //create css
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.textContent = this.__text;
    return { element };
  }

  isSegmented(): false {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  isToken(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode({
  mentionName,
  displayName,
  userId,
  userInternalId,
  userPublicId,
}: {
  mentionName: string;
  displayName?: string;
  userId?: string;
  userInternalId?: string;
  userPublicId?: string;
}): MentionNode {
  const mentionNode = new MentionNode({
    mentionName: `@${mentionName}`,
    displayName: displayName,
    userId: userId,
    userInternalId: userInternalId,
    userPublicId: userPublicId,
  })
    .setMode('segmented')
    .toggleDirectionless();
  return mentionNode;
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode;
}
