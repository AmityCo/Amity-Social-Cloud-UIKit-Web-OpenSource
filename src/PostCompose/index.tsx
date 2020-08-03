import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { customizableComponent } from '../hoks/customization';
import Files from '../Files';
import Images from '../Images';

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
  {
    filename: 'filename.audio',
    size: 12323,
  },
  {
    filename: 'filename.ogg',
    size: 12323,
  },
  {
    filename: 'filename.aac',
    size: 12323,
  },
  {
    filename: 'filename.avi',
    size: 12323,
  },
  {
    filename: 'filename.csv',
    size: 12323,
  },
  {
    filename: 'filename.doc',
    size: 12323,
  },
  {
    filename: 'filename.exe',
    size: 12323,
  },
  {
    filename: 'filename.html',
    size: 12323,
  },
  {
    filename: 'filename.jpg',
    size: 12323,
  },
  {
    filename: 'filename.png',
    size: 12323,
  },
  {
    filename: 'filename.gif',
    size: 12323,
  },
  {
    filename: 'filename.mov',
    size: 12323,
  },
  {
    filename: 'filename.mp3',
    size: 12323,
  },
  {
    filename: 'filename.mp4',
    size: 12323,
  },
  {
    filename: 'filename.mpeg',
    size: 12323,
  },
  {
    filename: 'filename.pdf',
    size: 12323,
  },
  {
    filename: 'filename.ppt',
    size: 12323,
  },
  {
    filename: 'filename.ppx',
    size: 12323,
  },
  {
    filename: 'filename.rar',
    size: 12323,
  },
  {
    filename: 'filename.txt',
    size: 12323,
  },
  {
    filename: 'filename.xls',
    size: 12323,
  },
  {
    filename: 'filename.zip',
    size: 12323,
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
    const image = testImages[images.length % testImages.length];
    setImages([...images, { id: Date.now(), ...image }]);
  };

  const addFile = () => {
    const file = testFiles[files.length % testFiles.length];
    setFiles([...files, { id: Date.now(), ...file }]);
  };

  const onRemoveFile = file => {
    setFiles(files.filter(({ id }) => id !== file.id));
  };

  const onRemoveImage = image => {
    setImages(images.filter(({ id }) => id !== image.id));
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
          {!!images.length && <Images images={images} onRemove={onRemoveImage} />}
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
