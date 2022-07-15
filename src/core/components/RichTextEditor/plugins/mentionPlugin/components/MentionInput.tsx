import React from 'react';
import { getHandler, Value, MentionInputElementProps } from '@udecode/plate';
import { useFocused, useSelected } from 'slate-react';

import { Text } from '@noom/wax-component-library';

export const MentionInput = <V extends Value>(props: MentionInputElementProps<V>) => {
  const { attributes, children, nodeProps, element, onClick } = props;

  const selected = useSelected();
  const focused = useFocused();

  const styles = {
    p: 1,
    borderRadius: 'md',
    shadow: selected && focused ? 'outline' : undefined,
  };

  return (
    <Text
      {...attributes}
      {...styles}
      data-slate-value={element.value}
      onClick={getHandler(onClick, element)}
      {...nodeProps}
    >
      {children}
    </Text>
  );
};
