import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PostDataType, PostRepository } from '@amityco/js-sdk';

import usePost from '~/social/hooks/usePost';
import Content from './Content';
import { PostEditorContainer, Footer, ContentContainer, PostButton } from './styles';

const PostEditor = ({ postId, onSave, className, placeholder }) => {
  const { post, handleUpdatePost, childrenPosts = [] } = usePost(postId);
  const { data, dataType } = post;

  // Text content for the post being rendered with postId (parent post).
  const [localParentText, setLocalParentText] = useState('');
  useEffect(() => setLocalParentText(data?.text || ''), [data]);

  const handleChangeParentText = text => {
    setLocalParentText(text);
  };

  // Children posts of the post being rendered with postId.
  const [localChildrenPosts, setLocalChildrenPosts] = useState(childrenPosts);
  useEffect(() => setLocalChildrenPosts(childrenPosts), [childrenPosts]);

  // List of the children posts removed - these will be deleted on save.
  const [localRemovedChildren, setLocalRemovedChildren] = useState([]);

  const handleRemoveChild = childPostId => {
    const updatedChildren = localChildrenPosts.filter(child => child.postId !== childPostId);
    setLocalChildrenPosts(updatedChildren);
    setLocalRemovedChildren(prevRemovedChildren => [...prevRemovedChildren, childPostId]);
  };

  // Update parent post text and delete removed children posts.
  const handleSave = () => {
    localRemovedChildren.forEach(childPostId => {
      PostRepository.deletePost(childPostId);
    });
    handleUpdatePost({ text: localParentText });
    onSave();
  };

  const isEmpty = useMemo(() => localParentText?.trim() === '' && !localChildrenPosts.length, [
    localParentText,
    localChildrenPosts,
  ]);

  const childFilePosts = useMemo(
    () => localChildrenPosts.filter(childPost => childPost.dataType === PostDataType.FilePost),
    [localChildrenPosts],
  );

  const childImagePosts = useMemo(
    () => localChildrenPosts.filter(childPost => childPost.dataType === PostDataType.ImagePost),
    [localChildrenPosts],
  );

  const childVideoPosts = useMemo(
    () => localChildrenPosts.filter(childPost => childPost.dataType === PostDataType.VideoPost),
    [localChildrenPosts],
  );

  return (
    <PostEditorContainer className={className}>
      <ContentContainer>
        <Content
          data={{ text: localParentText }}
          dataType={dataType}
          placeholder={placeholder}
          onChangeText={handleChangeParentText}
        />
        {childImagePosts.length > 0 && (
          <Content
            data={childImagePosts}
            dataType={PostDataType.ImagePost}
            onRemoveChild={handleRemoveChild}
          />
        )}
        {childVideoPosts.length > 0 && (
          <Content
            data={childVideoPosts}
            dataType={PostDataType.VideoPost}
            onRemoveChild={handleRemoveChild}
          />
        )}
        {childFilePosts.length > 0 && (
          <Content
            data={childFilePosts}
            dataType={PostDataType.FilePost}
            onRemoveChild={handleRemoveChild}
          />
        )}
      </ContentContainer>
      <Footer>
        <PostButton disabled={isEmpty} onClick={handleSave}>
          Save
        </PostButton>
      </Footer>
    </PostEditorContainer>
  );
};

PostEditor.propTypes = {
  postId: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

PostEditor.defaultProps = {
  onSave: () => {},
  className: null,
  placeholder: "What's going on...",
};

export default memo(PostEditor);
