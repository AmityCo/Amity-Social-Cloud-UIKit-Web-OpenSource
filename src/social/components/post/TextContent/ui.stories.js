import React from 'react';
import PostTextContent from '.';

export default {
  title: 'Ui Only/Social/Post/TextContent',
};

export const UIPostTextContent = (props) => (
  <div
    style={{
      width: '200px',
      height: '100px',
      border: '1px dashed darkgrey',
      padding: '20px',
      borderRadius: '6px',
    }}
  >
    <PostTextContent {...props} />
  </div>
);

UIPostTextContent.storyName = 'Text content';

UIPostTextContent.args = {
  text: 'Some post text that goes over maxPostLines lines long',
  postMaxLines: 2,
};

UIPostTextContent.argTypes = {
  text: { control: { type: 'text' } },
  postMaxLines: { control: { type: 'number' } },
};

export const UIPostMentionsContent = (props) => (
  <div
    style={{
      width: '200px',
      height: '100px',
      border: '1px dashed darkgrey',
      padding: '20px',
      borderRadius: '6px',
    }}
  >
    <PostTextContent {...props} />
  </div>
);

UIPostMentionsContent.storyName = 'Mentions content';

UIPostMentionsContent.args = {
  text: 'Hello there @Bristina and @Mike!!',
  postMaxLines: 2,
  mentionees: [
    {
      index: 12,
      length: 8,
      type: 'user',
      userId: 'J0FWLUST',
    },
    {
      index: 26,
      length: 4,
      type: 'user',
      userId: 'J0FWLUST',
    },
  ],
};

UIPostMentionsContent.argTypes = {
  text: { control: { type: 'text' } },
  postMaxLines: { control: { type: 'number' } },
};

export const UIPostMarkdownContent = (props) => (
  <div
    style={{
      width: '200px',
      height: '100px',
      border: '1px dashed darkgrey',
      padding: '20px',
      borderRadius: '6px',
    }}
  >
    <PostTextContent {...props} />
  </div>
);

UIPostMarkdownContent.storyName = 'Markdown content';

UIPostMarkdownContent.args = {
  text: 'A paragraph with *emphasis* and **strong importance**. Welcome to [Noom](https://www.noom.com/).',
  postMaxLines: 2,
};

UIPostMarkdownContent.argTypes = {
  text: { control: { type: 'text' } },
  postMaxLines: { control: { type: 'number' } },
};
