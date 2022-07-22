import { TElement, Data, NoData, CreateMentionNode, TComboboxItemWithData } from '@udecode/plate';

export type MentionType = 'user' | 'tag';

export type MentionInputElement = TElement & {
  trigger: string;
};

export type MentionPlugin<TData extends Data = NoData> = {
  createMentionNode?: CreateMentionNode<TData>;
  id?: string;
  insertSpaceAfterMention?: boolean;
  trigger?: string;
  inputCreation?: { key: string; value: string };
};

export type MentionData = {
  avatar?: string;
  display: string;
  id: string;
  isLastItem: boolean;
};

export type MentionItem = TComboboxItemWithData<MentionData>;

export type MentionOutput = {
  id: string;
  index: number;
  childIndex: number;
  plainTextIndex: number;
  display: string;
};
