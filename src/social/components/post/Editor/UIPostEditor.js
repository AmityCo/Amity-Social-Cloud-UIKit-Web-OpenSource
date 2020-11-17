import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { EkoPostDataType } from 'eko-sdk';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import {
  PostCreatorContainer,
  Footer,
  PostContainer,
  PostButton,
} from '~/social/components/post/Creator/styles';
import { PostCreatorTextareaWrapper, PostCreatorTextarea, FooterActionBar } from './styles';

const PostEditor = ({
  className = '',
  placeholder = '',

  data = {},
  dataType = EkoPostDataType.TextPost,
  onChange = () => {},
}) => {
  const [localData, setLocalData] = useState({});

  useEffect(() => setLocalData({ ...data }), [data]);

  const isEmpty = useMemo(() => localData?.text?.trim() === '', [localData]);

  const handleClick = useCallback(() => onChange(localData), [localData]);

  return (
    <PostCreatorContainer className={className} edit>
      <PostContainer>
        {/* TODO: implement switch case based on dataType for image/file */}
        <ConditionalRender condition={!!dataType}>
          <PostCreatorTextareaWrapper edit>
            <PostCreatorTextarea
              placeholder={placeholder}
              type="text"
              value={localData?.text}
              onChange={e => setLocalData({ text: e.target.value })}
            />
          </PostCreatorTextareaWrapper>
        </ConditionalRender>
        <Footer edit>
          <FooterActionBar>
            <PostButton disabled={isEmpty} onClick={handleClick}>
              Save
            </PostButton>
          </FooterActionBar>
        </Footer>
      </PostContainer>
    </PostCreatorContainer>
  );
};

PostEditor.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,

  data: PropTypes.object.isRequired,
  dataType: PropTypes.string,
  onChange: PropTypes.func,
};

export default customizableComponent('PostEditor', PostEditor);
