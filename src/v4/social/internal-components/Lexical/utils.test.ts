import { Metadata, Mentionees } from '~/v4/helpers/utils';
import { editorStateToText, textToEditorState } from './utils';

type Input = {
  data: {
    text: string;
  };
  metadata: Metadata;
  mentionees: Mentionees;
};

const inputsV3: Input[] = [
  {
    data: {
      text: '@Web-Test hello @FonTS ',
    },
    metadata: {
      mentioned: [
        {
          index: 0,
          length: 8,
          type: 'user',
          userId: 'Web-Test',
        },
        {
          index: 16,
          length: 5,
          type: 'user',
          userId: 'FonTS',
        },
      ],
    },
    mentionees: [
      {
        type: 'user',
        userIds: ['Web-Test', 'FonTS'],
      },
    ],
  },
];

const inputsV4: Input[] = [
  {
    data: {
      text: '1 @ android2 nstaehunstah @ android2 @Web-Test aenotuhnasetouhnsateohunsatheunst sntaehuns\nSTnseatu @ android3 ',
    },
    metadata: {
      mentioned: [
        { index: 2, length: 9, type: 'user', userId: ' android2', displayName: ' android2' },
        { index: 26, length: 9, type: 'user', userId: ' android2', displayName: ' android2' },
        { index: 37, length: 8, type: 'user', userId: 'Web-Test', displayName: 'Web-Test' },
        { index: 100, length: 9, type: 'user', userId: ' android3', displayName: ' android3' },
      ],
    },
    mentionees: [{ type: 'user', userIds: [' android2', ' android2', 'Web-Test', ' android3'] }],
  },
  {
    data: {
      text: 'www.google.com\nwww.youtube.com',
    },
    metadata: {
      mentioned: [],
    },
    mentionees: [],
  },
];

describe('v3', () => {
  test.each(inputsV3)('should return a same object', (input) => {
    const editorState = textToEditorState(input);

    expect(editorState).toMatchSnapshot();

    const actual = editorStateToText(editorState);
    expect(actual.text).toEqual(input.data.text);
    const expectedMentioned = (input.metadata.mentioned || []).map((m) => ({
      ...m,
      displayName: m.userId,
    }));
    expect(actual.mentioned).toEqual(expectedMentioned);
    expect(actual.mentionees).toEqual(input.mentionees);
  });
});

describe('v4', () => {
  test.each(inputsV4)('should return a same object', (input) => {
    const editorState = textToEditorState(input);

    expect(editorState).toMatchSnapshot();

    const actual = editorStateToText(editorState);
    expect(actual.text).toEqual(input.data.text);
    const expectedMentioned = actual.mentioned.map(({ ...m }) => m);
    expect(expectedMentioned).toEqual(input.metadata.mentioned);
    expect(actual.mentionees).toEqual(input.mentionees);
  });
});
