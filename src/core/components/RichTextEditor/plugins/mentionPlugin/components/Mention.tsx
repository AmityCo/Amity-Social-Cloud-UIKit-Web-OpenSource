import React from 'react';
import { Link } from '@noom/wax-component-library';
import { MentionElement } from '../../../models';

import { MentionSymbol } from '../constants';

export type MentionProps = {
  children?: React.ReactNode;
  element: MentionElement;
  attributes?: any;
};

export const Mention = (props: MentionProps) => {
  const { attributes, children, element } = props;

  const { value, mentionType } = element;

  return (
    <Link
      {...attributes}
      contentEditable={false}
      data-slate-value={value}
      data-cy={`mention-${value?.replace(' ', '-')}`}
    >
      {children}
      {MentionSymbol[mentionType]}
      {value}
    </Link>
  );
};
