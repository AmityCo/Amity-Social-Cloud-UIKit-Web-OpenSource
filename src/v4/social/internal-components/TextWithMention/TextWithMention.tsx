import { SerializedTextNode } from 'lexical';
import React, { useMemo } from 'react';
import { Typography } from '~/v4/core/components/index';
import { Mentioned } from '~/v4/helpers/utils';
import { TextToEditorState } from '../../components/PostCommentComposer/PostCommentInput';
import styles from './TextWithMention.module.css';

interface TextWithMentionProps {
  data: {
    text: string;
  };
  mentionees: Amity.UserMention[];
  metadata?: {
    mentioned?: Mentioned[];
  };
}

export const TextWithMention = (props: TextWithMentionProps) => {
  const editorState = useMemo(() => {
    return TextToEditorState(props);
  }, [props]);

  return (
    <>
      {editorState.root.children.map((child, index) => {
        return (
          <Typography.Body key={index}>
            {child.children.map((text, index) => {
              if ((text as SerializedTextNode).type === 'mention') {
                return (
                  <span key={index} className={styles.textWithMention__mention}>
                    {(text as SerializedTextNode).text}
                  </span>
                );
              }
              return (
                <span key={index} className={styles.textWithMention__text}>
                  {(text as SerializedTextNode).text}
                </span>
              );
            })}
          </Typography.Body>
        );
      })}
    </>
  );
};
