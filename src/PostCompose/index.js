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
  Footer,
  FooterActionBar,
  PostContainer,
  PostButton,
  Avatar,
  PostAsCommunityContainer,
  Checkbox,
  Caption,
} from './styles';

const MAX_IMAGES = 10;
const MAX_FILES = 10;

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
  {
    url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
  },
];

const PostAsCommunity = ({ value, onChange }) => (
  <PostAsCommunityContainer>
    <Checkbox checked={value} onChange={e => onChange(e.target.checked)} />
    <div>
      Post as community
      <Caption>Enable this will publish the post on behalf of community account</Caption>
    </div>
  </PostAsCommunityContainer>
);

const isIdenticalAuthor = (a, b) =>
  (!!a.userId && a.userId == b.userId) || (!!a.communityId && a.communityId == b.communityId);

const PostComposeBar = ({
  user = { userId: 1, name: 'John' },
  community = { communityId: 33, name: 'Harry Potter Fans' },
  communities,
  inGlobalFeed,
  edit,
  post = {},
  onSubmit,
  onSave,
  className,
}) => {
  const [author, setAuthor] = useState(user);
  const [text, setText] = useState(post.text || '');
  const [files, setFiles] = useState(post.files || []);
  const [images, setImages] = useState(post.images || []);

  const isEmpty = text.trim().length === 0 && files.length === 0 && images.length === 0;

  const isCommunityPost = isIdenticalAuthor(author, community);

  const setIsCommunityPost = shouldBeCommunityPost =>
    setAuthor(shouldBeCommunityPost ? community : user);

  const createPost = () => {
    if (isEmpty) return;
    onSubmit({
      id: Date.now(),
      author,
      text,
      files,
      images,
    });
    setText('');
    setFiles([]);
    setImages([]);
  };

  const updatePost = () => {
    if (isEmpty) return;
    onSave({
      ...post,
      text,
      files,
      images,
    });
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

  const canUploadImage = files.length === 0 && images.length < MAX_IMAGES;
  const canUploadFile = images.length === 0 && files.length < MAX_FILES;

  return (
    <PostComposeContainer className={className} edit={edit}>
      {!edit && <Avatar />
      /* (inGlobalFeed ? <RoleSelector author={author} communities={communities} /> : <Avatar />) */
      }
      <PostContainer>
        <PostComposeTextareaWrapper edit={edit}>
          <PostComposeTextarea
            placeholder="What's going on..."
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          {!!files.length && <Files editing files={files} onRemove={onRemoveFile} />}
          {!!images.length && <Images editing images={images} onRemove={onRemoveImage} />}
        </PostComposeTextareaWrapper>
        <Footer edit={edit}>
          {!edit && !!community && (
            <PostAsCommunity value={isCommunityPost} onChange={setIsCommunityPost} />
          )}
          <FooterActionBar>
            <ImagePostIcon disabled={!canUploadImage} onClick={canUploadImage && addImage} />
            <FilePostIcon disabled={!canUploadFile} onClick={canUploadFile && addFile} />
            <PostButton disabled={isEmpty} onClick={edit ? updatePost : createPost}>
              {edit ? 'Save' : 'Post'}
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostComposeContainer>
  );
};

export default customizableComponent('PostComposeBar')(PostComposeBar);
