import React from 'react';
import styled from 'styled-components';
import InputText from '~/core/components/InputText';
import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';

const TextareaWrapper = styled.div`
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: none;
`;

const Textarea = styled(InputText).attrs({ rows: 1, maxRows: 15 })`
  outline: none;
  border: none;
  resize: none;
  font: inherit;
`;

interface TextContentProps {
  text: string;
  placeholder?: string;
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
  queryMentionees: QueryMentioneesFnType;
}

const TextContent = ({ text, placeholder, onChange, queryMentionees }: TextContentProps) => {
  return (
    <TextareaWrapper>
      <Textarea
        data-qa-anchor="post-editor-textarea"
        placeholder={placeholder}
        value={text}
        multiline
        mentionAllowed
        queryMentionees={queryMentionees}
        onChange={onChange}
      />
    </TextareaWrapper>
  );
};

export default TextContent;
