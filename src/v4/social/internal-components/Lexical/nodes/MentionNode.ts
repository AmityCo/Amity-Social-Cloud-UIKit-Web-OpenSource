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

import styles from './MentionNode.module.css';

export type SerializedMentionNode<T> = Spread<
  {
    data: T;
    type: 'mention';
    version: 1;
  },
  SerializedTextNode
>;

function convertMentionElement<T>({
  domNode,
  data,
}: {
  domNode: HTMLElement;
  data: T;
}): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode<T>({
      text: textContent,
      data,
    });
    return {
      node,
    };
  }

  return null;
}

export class MentionNode<T> extends TextNode {
  __data: T;

  static getType(): string {
    return 'mention';
  }

  static clone<T>(node: MentionNode<T>): MentionNode<T> {
    return new MentionNode<T>({
      data: node.__data,
      text: node.__text,
      key: node.__key,
    });
  }

  static importJSON<T>(serializedNode: SerializedMentionNode<T>): MentionNode<T> {
    const node = $createMentionNode({
      text: serializedNode.text,
      data: serializedNode.data,
    });
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor({ text, data, key }: { text: string; data: T; key?: NodeKey }) {
    super(text, key);
    this.__data = data;
  }

  exportJSON(): SerializedMentionNode<T> {
    return {
      ...super.exportJSON(),
      data: this.__data,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.className = styles.mention; //create css
    dom.setAttribute('data-qa-anchor', 'mention-preview');
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.setAttribute('data-mention-data', JSON.stringify(this.__data));
    element.textContent = this.__text;
    return { element };
  }

  isSegmented(): false {
    return false;
  }

  static importDOM<T>(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: (domNode: HTMLElement) =>
            convertMentionElement({
              domNode,
              data: JSON.parse(domNode.getAttribute('data-mention-data') ?? '{}'),
            }),
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

export function $createMentionNode<T>({ text, data }: { text: string; data: T }): MentionNode<T> {
  const mentionNode = new MentionNode<T>({
    data,
    text,
  })
    .setMode('segmented')
    .toggleDirectionless();
  return mentionNode;
}

export function $isMentionNode<T>(node: LexicalNode | null | undefined): node is MentionNode<T> {
  return node instanceof MentionNode;
}
