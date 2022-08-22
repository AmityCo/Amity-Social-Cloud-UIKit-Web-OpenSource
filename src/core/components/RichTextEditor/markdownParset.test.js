import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { EMPTY_VALUE } from './constants';

const markdownText =
  '# Hello\nHello there this is **bold** and _italic_ and ~~strike~~ and [link](https://google.com)!\n\nparagraph\nwith newline\n\n- hello there \n- what is this \n- keeee \n\n  - What is this? \n\n- fsfsfs \n- dddsa \n\n> Quoting Don Qyote!\n\nChek this out @[Sam Smith](TEST4322)!';

const slateState = [
  {
    type: 'h1',
    children: [
      {
        text: 'Hello',
      },
    ],
  },
  {
    type: 'p',
    children: [
      {
        text: 'Hello there this is ',
      },
      {
        bold: true,
        text: 'bold',
      },
      {
        text: ' and ',
      },
      {
        italic: true,
        text: 'italic',
      },
      {
        text: ' and ',
      },
      {
        strikeThrough: true,
        text: 'strike',
      },
      {
        text: ' and ',
      },
      {
        type: 'a',
        link: 'https://google.com',
        children: [
          {
            text: 'link',
          },
        ],
      },
      {
        text: '!',
      },
    ],
  },
  {
    type: 'p',
    children: [
      {
        text: 'paragraph\nwith newline',
      },
    ],
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'hello there',
              },
            ],
          },
        ],
      },
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'what is this',
              },
            ],
          },
        ],
      },
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'keeee',
              },
            ],
          },
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [
                  {
                    type: 'p',
                    children: [
                      {
                        text: 'What is this?',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'fsfsfs',
              },
            ],
          },
        ],
      },
      {
        type: 'li',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'dddsa',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'blockquote',
    children: [
      {
        text: 'Quoting Don Qyote!',
      },
    ],
  },
  {
    type: 'p',
    children: [
      {
        text: 'Chek this out ',
      },
      {
        type: 'mention',
        children: [
          {
            text: '',
          },
        ],
        id: 'TEST4322',
        value: 'Sam Smith',
        mentionType: 'user',
      },
      {
        text: '!',
      },
    ],
  },
];

describe('markdownToSlate', () => {
  test('should transform empty string to an empty value', () => {
    expect(markdownToSlate('')).toEqual([EMPTY_VALUE]);
  });

  test('should transform markdown string to a slate state', () => {
    expect(markdownToSlate(markdownText)).toEqual(slateState);
  });
});

describe('slateToMarkdown', () => {
  test('should transform empty array to a string', () => {
    expect(slateToMarkdown([]).text).toEqual('');
  });

  test('should transform markdown string to a slate state', () => {
    expect(slateToMarkdown(slateState).text.trim()).toEqual(markdownText);
  });

  test('should correctly export mentions', () => {
    expect(slateToMarkdown(slateState).mentions).toEqual([
      {
        index: 239,
        display: '@Sam Smith',
        id: 'TEST4322',
        plainTextIndex: 239,
        childIndex: 0,
      },
    ]);
  });

  const stateWithMultipleMentions = [
    {
      type: 'p',
      children: [
        {
          text: '',
        },
        {
          type: 'mention',
          children: [
            {
              text: '',
            },
          ],
          id: 'TEST4322',
          value: 'Sam Smith',
          mentionType: 'user',
        },
        {
          text: ' and ',
        },
        {
          type: 'mention',
          children: [
            {
              text: '',
            },
          ],
          id: 'Web-Test',
          value: 'Web-Test',
          mentionType: 'user',
        },
        {
          text: ' and ',
        },
        {
          type: 'mention',
          children: [
            {
              text: '',
            },
          ],
          id: 'TEST1345',
          value: 'Testko Testic',
          mentionType: 'user',
        },
        {
          text: '',
        },
      ],
    },
  ];

  test('should correctly export two mentions in a list', () => {
    expect(slateToMarkdown(stateWithMultipleMentions).mentions).toEqual([
      {
        index: 0,
        display: '@Sam Smith',
        id: 'TEST4322',
        plainTextIndex: 0,
        childIndex: 0,
      },
      {
        childIndex: 0,
        display: '@Web-Test',
        id: 'Web-Test',
        index: 27,
        plainTextIndex: 15,
      },
      {
        index: 53,
        display: '@Testko Testic',
        id: 'TEST1345',
        plainTextIndex: 29,
        childIndex: 0,
      },
    ]);
  });
});

('@Sam Smith and @Web-Test and @Testko Testic');
('@[Sam Smith](TEST4322) and @[Web-Test](Web-Test) and @[Testko Testic](TEST1345)');
