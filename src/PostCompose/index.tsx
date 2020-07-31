import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { customizableComponent } from '../hoks/customization';
import Files from '../Files';

import {
  PostComposeContainer,
  PostComposeTextarea,
  PostComposeTextareaWrapper,
  ImagePostIcon,
  FilePostIcon,
  ActionsBar,
  PostContainer,
  PostButton,
  Avatar,
} from './styles';

const testFiles = [
  {
    filename: 'text.txt',
    size: 259,
  },
  {
    filename: 'book.pdf',
    size: 223893,
  },
  {
    filename: 'podcast.ogg',
    size: 2293893,
  },
  {
    filename: 'movie.avi',
    size: 229389322,
  },
  {
    filename: 'page.html',
    size: 1024,
  },
  {
    filename: 'presentation.ppt',
    size: 2139232,
  },
  {
    filename: 'archive.zip',
    size: 123123132923,
  },
];

const testImages = [
  {
    url:
      'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
];

const PostComposeBar = ({ onSubmit, className }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [isCommunityPost, setIsCommunityPost] = useState(false);

  const isEmpty = text.length === 0 && files.length === 0 && images.length === 0;

  const createPost = () => {
    if (isEmpty) return;
    onSubmit({
      id: Date.now(),
      author: { name: 'John' },
      text,
      files,
      images,
    });
    setText('');
    setFiles([]);
    setImages([]);
  };

  const addImage = () => {
    setImages([...images, testImages[0]]);
  };

  const addFile = () => {
    const file = testFiles[files.length % testFiles.length];
    setFiles([...files, { id: Date.now(), ...file }]);
  };

  const onRemoveFile = file => {
    setFiles(files.filter(({ id }) => id !== file.id));
  };

  return (
    <PostComposeContainer className={className}>
      <PostContainer>
        <Avatar />
        <PostComposeTextareaWrapper>
          <PostComposeTextarea
            placeholder="Type your post..."
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          {!!files.length && <Files files={files} onRemove={onRemoveFile} />}
        </PostComposeTextareaWrapper>
      </PostContainer>
      <ActionsBar>
        <ImagePostIcon onClick={addImage} />
        <FilePostIcon onClick={addFile} />
        <PostButton disabled={isEmpty} onClick={createPost}>
          Post
        </PostButton>
      </ActionsBar>
    </PostComposeContainer>
  );
};

export default customizableComponent('PostComposeBar')(PostComposeBar);
