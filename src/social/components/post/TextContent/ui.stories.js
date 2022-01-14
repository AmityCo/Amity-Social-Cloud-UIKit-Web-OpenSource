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
