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
import styles from './HashtagNode.module.css';

export type SerializedHashtagNode = Spread<
  {
    hashtag: string;
    type: 'hashtag';
    version: 1;
  },
  SerializedTextNode
>;

function convertHashtagElement(domNode: HTMLElement): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  if (textContent !== null) {
    const node = $createHashtagNode({
      text: textContent,
      hashtag: textContent.substring(1),
    });
    return { node };
  }
  return null;
}

export class HashtagNode extends TextNode {
  __hashtag: string;

  static getType(): string {
    return 'hashtag';
  }

  static clone(node: HashtagNode): HashtagNode {
    return new HashtagNode({
      hashtag: node.__hashtag,
      text: node.__text,
      key: node.__key,
    });
  }

  static importJSON(serializedNode: SerializedHashtagNode): HashtagNode {
    const node = $createHashtagNode({
      text: serializedNode.text,
      hashtag: serializedNode.hashtag,
    });
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-hashtag')) return null;
        return {
          conversion: convertHashtagElement,
          priority: 1,
        };
      },
    };
  }

  constructor({ text, hashtag, key }: { text: string; hashtag: string; key?: NodeKey }) {
    super(text, key);
    this.__hashtag = hashtag;
  }

  exportJSON(): SerializedHashtagNode {
    return {
      ...super.exportJSON(),
      hashtag: this.__hashtag,
      type: 'hashtag',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span');
    element.className = styles.hashtag;
    element.setAttribute('data-lexical-hashtag', 'true');
    element.setAttribute('data-testid', 'hashtag-preview');
    element.textContent = this.__text;
    return element;
  }

  updateDOM(prevNode: HashtagNode, dom: HTMLElement, config: EditorConfig): boolean {
    const inner = dom;
    if (inner.textContent !== this.__text) {
      inner.textContent = this.__text;
    }
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-hashtag', 'true');
    element.setAttribute('data-hashtag', this.__hashtag);
    element.textContent = this.__text;
    return { element };
  }

  isSegmented(): false {
    return false;
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

  getHashtag(): string {
    return this.__hashtag;
  }

  // Override to prevent splitting
  splitText(...splitOffsets: number[]): TextNode[] {
    return [this];
  }

  // Override to maintain hashtag integrity
  mergeWithSibling(target: TextNode): TextNode {
    return this;
  }
}

export function $createHashtagNode({
  text,
  hashtag,
}: {
  text: string;
  hashtag: string;
}): HashtagNode {
  const node = new HashtagNode({ hashtag, text });
  node.setMode('token');
  return node;
}

export function $isHashtagNode(node: LexicalNode | null | undefined): node is HashtagNode {
  return node instanceof HashtagNode;
}
