import React from 'react';
import { Box, StyleProps } from '@noom/wax-component-library';

import {
  withPlateEventProvider,
  getPluginType,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MarkToolbarButton,
  usePlateEditorRef,
  ELEMENT_OL,
  ELEMENT_UL,
  ELEMENT_BLOCKQUOTE,
  ListToolbarButton,
  BlockToolbarButton,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  BalloonToolbar as PlateBalloonToolbar,
} from '@udecode/plate';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdCode,
  MdAddLink,
  MdLinkOff,
} from 'react-icons/md';

import { LinkToolbarButton, UnLinkToolbarButton } from './LinkButton';

import { Editor, EditorValue, MARK_STRIKETHROUGH } from '../models';
import { isLinkActive } from '../utils';

export type ToolbarProps = {
  isVisible?: boolean;
  editorId?: string;
};

export const ToolbarWrap = withPlateEventProvider((props: StyleProps) => (
  <Box display="flex" mb={1} {...props} />
));

export const Toolbar = ({ isVisible, editorId }: ToolbarProps) => {
  const editor = usePlateEditorRef<EditorValue, Editor>(editorId);

  if (!editor) {
    return null;
  }

  return (
    <ToolbarWrap display={isVisible ? 'flex' : 'none'}>
      <MarkToolbarButton type={getPluginType(editor, MARK_BOLD)} icon={<MdFormatBold />} dis />
      <MarkToolbarButton type={getPluginType(editor, MARK_ITALIC)} icon={<MdFormatItalic />} />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<MdFormatStrikethrough />}
      />
      <MarkToolbarButton type={getPluginType(editor, MARK_CODE)} icon={<MdCode />} />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<MdFormatQuote />}
      />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_UL)} icon={<MdFormatListBulleted />} />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_OL)} icon={<MdFormatListNumbered />} />
      <LinkToolbarButton icon={<MdAddLink />} />
      <UnLinkToolbarButton icon={<MdLinkOff />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon="H1" />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon="H2" />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon="H3" />
    </ToolbarWrap>
  );
};

export const BalloonToolbar = () => {
  const editor = usePlateEditorRef<EditorValue, Editor>();

  if (!editor) {
    return null;
  }

  const arrow = false;
  const theme = 'dark';

  return (
    <PlateBalloonToolbar theme={theme} arrow={arrow}>
      <MarkToolbarButton type={getPluginType(editor, MARK_BOLD)} icon={<MdFormatBold />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_ITALIC)} icon={<MdFormatItalic />} />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<MdFormatStrikethrough />}
      />

      {isLinkActive(editor) ? (
        <UnLinkToolbarButton icon={<MdLinkOff />} />
      ) : (
        <LinkToolbarButton icon={<MdAddLink />} />
      )}
    </PlateBalloonToolbar>
  );
};
