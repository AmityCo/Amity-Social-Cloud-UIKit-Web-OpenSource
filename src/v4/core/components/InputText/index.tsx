import React, { forwardRef } from 'react';

import InsideInputText from './InsideInputText';
import { QueryMentioneesFnType } from '~/v4/chat/hooks/useMention';

export interface InputTextProps {
  'data-qa-anchor'?: string;
  id?: string;
  input?: unknown;
  name?: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  rows?: number;
  maxRows?: number;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  className?: string;
  mentionAllowed?: boolean;
  isModerator?: boolean;
  queryMentionees?: QueryMentioneesFnType;
  loadMoreMentionees?: (query: string) => Promise<unknown>;
  onChange: (data: {
    text: string;
    plainText: string;
    lastMentionText?: string;
    mentions: {
      plainTextIndex: number;
      id: string;
      display: string;
    }[];
  }) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onClear?: () => void;
  onClick?: () => void;
  suggestionRef?: React.RefObject<HTMLDivElement>;
  mentionColor?: string;
}

const InputText = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputTextProps>(
  (props, ref) => {
    return <InsideInputText {...props} ref={ref} />;
  },
);

export default InputText;
