export { TextEditor } from './TextEditor';
export type {
  TextEditorProps,
  TextEditorHandle,
  EditorContentType,
  SuggestionDisplayMode,
  UrlHighlight,
} from './TextEditor';

export { TextEditorLinkPreview } from '~/v4/core/components/TextEditorLinkPreview';
export type {
  TextEditorLinkPreviewProps,
  LinkRetentionState,
} from '~/v4/core/components/TextEditorLinkPreview';

export { useLinkPreview } from './hooks/useLinkPreview';
export type {
  UseLinkPreviewOptions,
  UseLinkPreviewResult,
  UrlHighlight as LinkPreviewUrlHighlight,
} from './hooks/useLinkPreview';
