/* eslint-disable no-undef */
// FIXME sdk import in ./utils throws an error in jest env
// import { parseMentionsMarkup } from './utils';

xdescribe('helpers/utils', () => {
  test('parseMentionsMarkup()', () => {
    // index - position of @symbol
    // length - the length of the user's name, it does not include @symbol

    const data = [
      [
        '@valeriy',
        { mentioned: [{ index: 0, length: 7, type: 'user', userId: 'valeriy' }] },
        '@[valeriy](valeriy)',
      ],
      [
        'Hi @valeriy!',
        { mentioned: [{ index: 3, length: 7, type: 'user', userId: 'valeriy' }] },
        'Hi @[valeriy](valeriy)!',
      ],
      [
        'Edit mentions test @valeriy @valeriy-test @valeriy-test1',
        {
          mentioned: [
            {
              index: 19,
              length: 7,
              type: 'user',
              userId: 'valeriy',
            },
            {
              index: 28,
              length: 12,
              type: 'user',
              userId: 'valeriy-test',
            },
            {
              index: 42,
              length: 13,
              type: 'user',
              userId: 'valeriy-test1',
            },
          ],
        },
        'Edit mentions test @[valeriy](valeriy) @[valeriy-test](valeriy-test) @[valeriy-test1](valeriy-test1)',
      ],
      [
        '@Pang6 @pang2',
        {
          mentioned: [
            {
              index: 0,
              length: 5,
              type: 'user',
              userId: 'Pang6',
            },
          ],
        },
        '@[Pang6](Pang6) @pang2',
      ],
      [
        '@Pang6 @pang2 testtest   @pang2',
        {
          mentioned: [
            {
              index: 0,
              length: 5,
              type: 'user',
              userId: 'Pang6',
            },
            {
              index: 7,
              length: 14,
              type: 'user',
              userId: 'pang2 testtest',
            },
            {
              index: 25,
              length: 5,
              type: 'user',
              userId: 'pang2',
            },
          ],
        },
        '@[Pang6](Pang6) @[pang2 testtest](pang2 testtest)   @[pang2](pang2)',
      ],
    ];

    data.forEach(([text, metadata, expected]) => {
      expect(parseMentionsMarkup(text, metadata)).toEqual(expected);
    });
  });
});
