import React, { useCallback, useState, ReactNode, useMemo } from 'react';

import { Plate, TEditableProps, createPlugins, getPlateActions } from '@udecode/plate';

import { Box } from '@noom/wax-component-library';

import { EditorValue, Editor } from '../models';
import { isEmptyValue, calculateRowStyles } from '../utils';
import { EMPTY_VALUE } from '../constants';
import { Toolbar, BalloonToolbar } from '.';

import { defaultElementsPlugins, defaultMarksPlugins } from '../plugins';
import { MentionPopover, MentionData, MentionItem, toMentionItem } from '../plugins/mentionPlugin';

import SocialMentionItem from '~/core/components/SocialMentionItem';

const renderMentionItem = (data: { item: MentionItem; search: string }) => {
  return (
    <SocialMentionItem
      // TODO: Add rootEl with actual popover scrolling element to enable infinite scroll
      id={data.item.key}
      isLastItem={data.item.data.isLastItem}
    />
  );
};

export const useEditor = (editorId: string) => {
  const clear = useCallback(() => {
    const plateActions = getPlateActions(editorId);
    plateActions.value([EMPTY_VALUE]);
    plateActions.resetEditor();
  }, [editorId]);

  return { clear };
};

const plugins = createPlugins<EditorValue, Editor>([
  ...defaultMarksPlugins,
  ...defaultElementsPlugins,
]);

type RichTextEditorProps = {
  id: string;
  name?: string;
  initialValue?: EditorValue;
  rows?: number;
  maxRows?: number;
  onClick?: () => void;
  onClear?: () => void;
  onChange: (data: { value: EditorValue; lastMentionText?: string; mentions: any[] }) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  mentionAllowed?: boolean;
  queryMentionees?: (search: string, callback: (data: MentionData[]) => void) => MentionData[];
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isToolbarVisible?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
  autoFocus?: boolean;
};

function RichTextEditor({
  id,
  name,
  initialValue = [EMPTY_VALUE],
  rows,
  maxRows,
  onChange,
  onClear,
  onClick,
  onFocus,
  onBlur,
  onKeyPress,
  isDisabled,
  isInvalid,
  placeholder,
  prepend,
  append,
  isToolbarVisible = true,
  autoFocus,
  queryMentionees,
  mentionAllowed,
}: RichTextEditorProps) {
  const [mentionData, setMentionData] = useState<MentionItem[]>([]);

  const onMentionSearchChange = useCallback(
    (search: string) => {
      if (search) {
        queryMentionees?.(search, (data) => setMentionData(data.map((d) => toMentionItem(d))));
      }
    },
    [setMentionData, queryMentionees],
  );

  function handleChange(newValue: EditorValue) {
    if (isEmptyValue(newValue)) {
      onClear?.();
    }
    onChange({ value: newValue, lastMentionText: '', mentions: [] });
  }

  const handleFocus = React.useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleBlur = React.useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const rowStyles = useMemo(() => calculateRowStyles(rows, maxRows), [rows, maxRows]);

  const editableProps: TEditableProps<EditorValue> = {
    name,
    onClick,
    placeholder,
    spellCheck: true,
    autoFocus,
    readOnly: isDisabled,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: onKeyPress,
  };

  return (
    <>
      <Toolbar editorId={id} isVisible={isToolbarVisible} />

      <Box
        border="1px solid"
        borderColor={isInvalid ? 'error.500' : 'gray.200'}
        boxSizing="border-box"
        borderRadius="md"
        cursor="text"
        paddingX={1}
        paddingY={2}
        sx={rowStyles}
      >
        {prepend}

        <Plate<EditorValue>
          id={id}
          onChange={(newValue) => handleChange(newValue)}
          plugins={plugins}
          initialValue={initialValue}
          editableProps={editableProps}
        >
          <BalloonToolbar />
          {mentionAllowed && (
            <MentionPopover<MentionData>
              items={mentionData}
              onRenderItem={renderMentionItem}
              onMentionSearchChange={onMentionSearchChange}
            />
          )}
        </Plate>
        {append}
      </Box>
    </>
  );
}

export default RichTextEditor;
