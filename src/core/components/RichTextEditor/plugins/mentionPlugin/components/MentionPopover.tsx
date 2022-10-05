import React, { useEffect, useRef } from 'react';
import {
  Data,
  NoData,
  getPluginOptions,
  usePlateEditorRef,
  ELEMENT_MENTION,
  getMentionOnSelectItem,
  Combobox,
  ComboboxProps,
  comboboxStore,
  useEventEditorSelectors,
} from '@udecode/plate';

import { MentionPlugin, MentionItem } from '../models';

export interface MentionComboboxProps<TData extends Data = NoData>
  extends Partial<ComboboxProps<TData>> {
  editorId?: string;
  pluginKey?: string;
  onMentionSearchChange?: (search: string) => void;
  onMentionSelect?: (item: MentionItem, search: string) => void;
}

export const MentionPopover = <TData extends Data = NoData>({
  pluginKey = ELEMENT_MENTION,
  id = pluginKey,
  onMentionSearchChange,
  editorId,
  items,
  ...props
}: MentionComboboxProps<TData>) => {
  const search = useRef<string | null>('');
  const editor = usePlateEditorRef(editorId)!;

  const { trigger } = getPluginOptions<MentionPlugin>(editor, pluginKey);

  const activeId = comboboxStore.use.activeId();
  const focusedEditorId = useEventEditorSelectors.focus();

  const open = comboboxStore.use.isOpen() ?? false;
  const text = comboboxStore.use.text() ?? '';

  const isOpen = !(!open || focusedEditorId !== editor.id || activeId !== id);

  useEffect(() => {
    if (isOpen && text !== search.current) {
      search.current = text;
      if (onMentionSearchChange) {
        onMentionSearchChange(text);
      }
    }
  }, [isOpen, text, search, onMentionSearchChange]);

  return (
    <Combobox
      id={id}
      trigger={trigger!}
      controlled
      onSelectItem={getMentionOnSelectItem({
        key: pluginKey,
      })}
      items={text ? items : []}
      styles={{
        root: {
          zIndex: 10000,
        },
      }}
      {...props}
    />
  );
};
