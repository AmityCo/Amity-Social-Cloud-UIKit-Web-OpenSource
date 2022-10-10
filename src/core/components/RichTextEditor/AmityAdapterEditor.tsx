import React, { ReactNode, useLayoutEffect, useRef } from 'react';

import RichTextEditor, { EditorHandle } from './components/Editor';
import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { EditorValue } from './models';
import { MentionOutput } from './plugins/mentionPlugin/models';
import { stripMentionTags } from './plugins/mentionPlugin/utils';

export type AmityAdapterProps = {
  id: string;
  name?: string;
  value?: string;
  rows?: number;
  maxRows?: number;
  onClick?: () => void;
  onClear?: () => void;
  onChange: (data: { text: string; plainText: string; mentions: MentionOutput[] }) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  mentionAllowed?: boolean;
  queryMentionees?: () => [];
  loadMoreMentionees?: () => [];
  initialMentionees?: MentionOutput[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  multiline?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
  autoFocus?: boolean;
};

export function AmityAdapterEditor({
  id,
  disabled,
  invalid,
  initialMentionees,
  value = '',
  onChange,
  rows = 3,
  ...rest
}: AmityAdapterProps) {
  const editorRef = useRef<EditorHandle>(null);

  useLayoutEffect(() => {
    if (value === '') {
      editorRef.current?.clear();
    }
  }, [value, editorRef]);

  const handleChange = (data: { value: EditorValue }) => {
    const newMarkdown = slateToMarkdown(data.value);

    onChange({
      text: newMarkdown.text,
      plainText: stripMentionTags(newMarkdown.text),
      mentions: newMarkdown.mentions,
    });
  };

  return (
    <RichTextEditor
      id={id}
      rows={rows}
      ref={editorRef}
      onChange={(data) => handleChange(data)}
      isDisabled={disabled}
      isInvalid={invalid}
      initialValue={markdownToSlate(value, initialMentionees)}
      isToolbarVisible
      {...rest}
    />
  );
}

export default AmityAdapterEditor;
