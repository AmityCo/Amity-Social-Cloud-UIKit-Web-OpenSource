import React from 'react';
import { getHandler, Value, MentionInputElementProps } from '@udecode/plate';
import { useFocused, useSelected } from 'slate-react';

import { MentionSymbol } from '../constants';
import { MentionInputElement } from '../models';

import { Text } from '@noom/wax-component-library';

export const MentionInput = (
  props: Omit<MentionInputElementProps<Value>, 'element'> & { element: MentionInputElement },
) => {
  const { attributes, children, nodeProps, element, onClick } = props;

  const selected = useSelected();
  const focused = useFocused();

  const styles = {
    paddingY: 0.2,
    pr: 1,
    borderRadius: 'md',
    shadow: selected && focused ? 'outline' : undefined,
    zIndex: 'sticky',
    display: 'inline-block',
  };

  return (
    <Text
      {...attributes}
      data-slate-value={element.value}
      onClick={getHandler(onClick, element)}
      position="relative"
      {...styles}
      {...nodeProps}
    >
      {element.trigger}
      {children}
    </Text>
  );
};
