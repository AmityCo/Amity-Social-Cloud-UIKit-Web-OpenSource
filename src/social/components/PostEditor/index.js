import React from 'react';
import PropTypes from 'prop-types';

import usePost from '~/social/hooks/usePost';
import UiPostEditor from './UIPostEditor';

const PostEditor = ({
  postId,
  onSave = () => {},

  className = null,
  placeholder = "What's going on...",
}) => {
  const { post, handleUpdatePost } = usePost(postId);

  const handleChange = data => {
    handleUpdatePost(data);
    onSave();
  };

  return (
    <UiPostEditor
      className={className}
      placeholder={placeholder}
      data={post.data || {}}
      dataType={post.dataType}
      onChange={handleChange}
    />
  );
};

PostEditor.propTypes = {
  postId: PropTypes.string.isRequired,
  onSave: PropTypes.func,

  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default PostEditor;
