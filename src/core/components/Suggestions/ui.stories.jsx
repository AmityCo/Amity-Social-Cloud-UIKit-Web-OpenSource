import React from 'react';
import { useArgs } from '@storybook/client-api';

import StyledSuggestions from '.';
import UiKitHighlight from '~/core/components/Highlight';

export default {
  title: 'Ui Only/Suggestions',
};

export const UiSuggestions = {
  render: () => {
    const [{ items, value, onPick }, updateArgs] = useArgs();

    const setValue = (newVal) => {
      onPick(newVal);
      updateArgs({ value: newVal });
    };

    return <StyledSuggestions items={items} value={value} onPick={setValue} />;
  },

  name: 'Simple suggestion list',

  args: {
    items: new Array(10).fill(0).map((_, i) => `value${i}`),
    value: -1,
  },

  argTypes: {
    items: { control: { type: 'array' } },
    value: { control: { type: 'number' } },
    onPick: { action: 'onPick()' },
  },
};

export const UiCustomSuggestion = {
  render: () => {
    const [{ query, items, onPick }] = useArgs();
    const filtered = query.length ? items.filter((item) => item.includes(query)) : items;

    return (
      <StyledSuggestions items={filtered} onPick={onPick}>
        {(item) => <UiKitHighlight key={item} text={item} query={query} />}
      </StyledSuggestions>
    );
  },

  name: 'Custom renderer',

  args: {
    query: '',
    items: [
      'lightsalmon',
      'salmon',
      'darksalmon',
      'lightcoral',
      'indianred',
      'crimson',
      'firebrick',
      'red',
      'darkred',
      'coral',
      'tomato',
      'orangered',
      'gold',
      'orange',
      'darkorange',
      'lightyellow',
      'lemonchiffon',
      'lightgoldenrodyellow',
      'papayawhip',
      'moccasin',
      'peachpuff',
      'palegoldenrod',
      'khaki',
      'darkkhaki',
      'yellow',
      'lawngreen',
      'chartreuse',
      'limegreen',
      'lime',
      'forestgreen',
      'green',
      'darkgreen',
      'greenyellow',
      'yellowgreen',
      'springgreen',
      'mediumspringgreen',
      'lightgreen',
      'palegreen',
      'darkseagreen',
      'mediumseagreen',
      'seagreen',
      'olive',
      'darkolivegreen',
      'olivedrab',
      'lightcyan',
      'cyan',
      'aqua',
      'aquamarine',
      'mediumaquamarine',
      'paleturquoise',
      'turquoise',
      'mediumturquoise',
      'darkturquoise',
      'lightseagreen',
      'cadetblue',
      'darkcyan',
      'teal',
      'powderblue',
      'lightblue',
      'lightskyblue',
      'skyblue',
      'deepskyblue',
      'lightsteelblue',
      'dodgerblue',
      'cornflowerblue',
      'steelblue',
      'royalblue',
      'blue',
      'mediumblue',
      'darkblue',
      'navy',
      'midnightblue',
      'mediumslateblue',
      'slateblue',
      'darkslateblue',
      'lavender',
      'thistle',
      'plum',
      'violet',
      'orchid',
      'fuchsia',
      'magenta',
      'mediumorchid',
      'mediumpurple',
      'blueviolet',
      'darkviolet',
      'darkorchid',
      'darkmagenta',
      'purple',
      'indigo',
      'pink',
      'lightpink',
      'hotpink',
      'deeppink',
      'palevioletred',
      'mediumvioletred',
      'white',
      'snow',
      'honeydew',
      'mintcream',
      'azure',
      'aliceblue',
      'ghostwhite',
      'whitesmoke',
      'seashell',
      'beige',
      'oldlace',
      'floralwhite',
      'ivory',
      'antiquewhite',
      'linen',
      'lavenderblush',
      'mistyrose',
      'gainsboro',
      'lightgray',
      'silver',
      'darkgray',
      'gray',
      'dimgray',
      'lightslategray',
      'slategray',
      'darkslategray',
      'black',
      'cornsilk',
      'blanchedalmond',
      'bisque',
      'navajowhite',
      'wheat',
      'burlywood',
      'tan',
      'rosybrown',
      'sandybrown',
      'goldenrod',
      'peru',
      'chocolate',
      'saddlebrown',
      'sienna',
      'brown',
      'maroon',
    ],
    value: -1,
  },

  argTypes: {
    query: { control: { type: 'text' } },
    items: { control: { type: 'array' } },
    onPick: { action: 'onPick()' },
  },
};
