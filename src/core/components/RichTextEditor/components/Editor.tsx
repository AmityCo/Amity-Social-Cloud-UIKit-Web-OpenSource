import React, {
  useCallback,
  useState,
  ReactNode,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import {
  Plate,
  TEditableProps,
  createPlugins,
  getPlateActions,
  PlateProvider,
} from '@udecode/plate';

import { Box, useBreakpointValue } from '@noom/wax-component-library';

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

export type EditorHandle = {
  clear: () => void;
};

const EditorClear = forwardRef<EditorHandle, { id: string }>(({ id }, ref) => {
  const clear = useCallback(() => {
    const plateActions = getPlateActions(id);
    plateActions.value([EMPTY_VALUE]);
    plateActions.resetEditor();
  }, [id]);

  useImperativeHandle(ref, () => ({ clear }));

  return null;
});

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

const RichTextEditor = forwardRef<EditorHandle, RichTextEditorProps>(
  (
    {
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
    },
    ref,
  ) => {
    const clearRef = useRef<EditorHandle>(null);
    const [mentionData, setMentionData] = useState<MentionItem[]>([]);
    const showBallonToolbar = useBreakpointValue({ base: false, lg: true });

    useImperativeHandle(ref, () => ({
      clear: () => {
        clearRef.current?.clear?.();
      },
    }));

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
      <PlateProvider id={id}>
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
            plugins={plugins}
            onChange={handleChange}
            initialValue={initialValue}
            editableProps={editableProps}
          >
            {showBallonToolbar && <BalloonToolbar />}
            {mentionAllowed && (
              <MentionPopover<MentionData>
                items={mentionData}
                onRenderItem={renderMentionItem}
                onMentionSearchChange={onMentionSearchChange}
              />
            )}
            <EditorClear id={id} ref={clearRef} />
          </Plate>
          {append}
        </Box>
      </PlateProvider>
    );
  },
);

export default RichTextEditor;
