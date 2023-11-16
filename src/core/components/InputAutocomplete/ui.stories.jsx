import React, { useState } from 'react';

import UiKitInputAutocomplete from '.';

export default {
  title: 'Ui Only',
};

export const UiInputAutocomplete = ({ items, onChange, onPick, ...rest }) => {
  const [value, setValue] = useState('');

  const handleChange = (newVal) => {
    onChange(newVal);
    setValue(newVal);
  };

  const handlePick = (newVal) => {
    setValue(newVal);
    onPick(newVal);
  };

  return (
    <UiKitInputAutocomplete
      value={value}
      items={items}
      onChange={handleChange}
      onPick={handlePick}
      {...rest}
    />
  );
};

UiInputAutocomplete.storyName = 'Input autocomplete';

UiInputAutocomplete.args = {
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
  expand: 1,
  invalid: false,
  disabled: false,
  placeholder: 'Input text',
};

UiInputAutocomplete.argTypes = {
  items: { control: { type: 'array' } },
  expand: { control: { type: 'number', min: 0, step: 1 } },
  invalid: { control: { type: 'boolean' } },
  disabled: { control: { type: 'boolean' } },
  placeholder: { control: { type: 'text' } },
  onChange: { action: 'onChange(value)' },
  onPick: { action: 'onPick(value)' },
};
