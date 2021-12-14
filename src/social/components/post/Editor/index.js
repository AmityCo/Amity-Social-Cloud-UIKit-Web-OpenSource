import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PostDataType, PostRepository } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';

import usePost from '~/social/hooks/usePost';
import usePostMention from '~/core/hooks/usePostMention';
import Content from './Content';
import { PostEditorContainer, Footer, ContentContainer, PostButton } from './styles';

const PostEditor = ({ postId, onSave, className, placeholder }) => {
  const { post, handleUpdatePost, childrenPosts = [] } = usePost(postId);
  const { data, dataType, feedId, metadata } = post;

  const fromRemoteToLocalMentionees = postMetadata => {
    if (!postMetadata) return [];

    const { mentioned } = postMetadata;

    if (!mentioned) return [];

    return mentioned.map(({ index, userId, markupIndex }) => ({
      length: userId?.length,
      id: userId,
      index: markupIndex,
      plainTextIndex: index,
    }));
  };

  const [queryMentionees] = usePostMention({ targetId: feedId });

  // Text content for the post being rendered with postId (parent post).
  const [localParentText, setLocalParentText] = useState('');
  const [localMarkupText, setLocalMarkupText] = useState('');
  const [postMentionees, setPostMentionees] = useState([]);

  useEffect(() => {
    setPostMentionees(fromRemoteToLocalMentionees(metadata));
    setLocalMarkupText(metadata?.markupText || '');
  }, [metadata]);

  useEffect(() => setLocalParentText(data?.text || ''), [data]);

  const handleChangeParentText = ({ text, markupText, mentions: editMentionees }) => {
    setLocalParentText(text);
    setLocalMarkupText(markupText);

    if (editMentionees?.length > 0) {
      setPostMentionees(editMentionees);
    }
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
  // TO REFACTOR: Extract this logic as a hook for Create Post too
  const handleSave = () => {
    let mentionees;
    const postMetadata = {};

    if (postMentionees?.length > 0) {
      mentionees = [{}];
      mentionees[0].type = 'user';
      mentionees[0].userIds = postMentionees.map(({ id }) => id);

      postMetadata.mentioned = postMentionees.map(({ plainTextIndex, id }) => ({
        index: plainTextIndex,
        length: id.length,
        type: 'user',
        userId: id,
      }));

      postMetadata.markupText = localMarkupText;
    }

    localRemovedChildren.forEach(childPostId => {
      PostRepository.deletePost(childPostId);
    });

    handleUpdatePost({ text: localParentText }, { mentionees, metadata: postMetadata });
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
          data={{ text: localMarkupText }}
          dataType={dataType}
          placeholder={placeholder}
          onChangeText={handleChangeParentText}
          queryMentionees={queryMentionees}
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
          <FormattedMessage id="save" />
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
