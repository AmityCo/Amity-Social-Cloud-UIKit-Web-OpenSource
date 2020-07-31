import React, { useState, useEffect } from 'react';
import Truncate from 'react-truncate-markup';
import Linkify from 'react-linkify';
import { customizableComponent } from '../hoks/customization';

import EngagementBar from '../EngagementBar';
import Avatar from '../Avatar';
import Files from '../Files';
import {
  PostContainer,
  PostHeader,
  PostContent,
  OptionsIcon,
  ShowMore,
  AuthorName,
  PostDate,
  PostInfo,
  ReadMoreButton,
} from './styles';

const hrefDecorator = (decoratedHref, decoratedText, key) => (
  <a target="blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
    {decoratedText}
  </a>
);

const Post = ({ className, post: { author, text, files, images } }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  return (
    <PostContainer className={className}>
      <PostHeader>
        <>
          <Avatar />
          <PostInfo>
            <AuthorName>{author.name}</AuthorName>
            <PostDate>30 min</PostDate>
          </PostInfo>
        </>
        <OptionsIcon />
      </PostHeader>
      <Linkify componentDecorator={hrefDecorator}>
        {isExpanded ? (
          <PostContent>{text}</PostContent>
        ) : (
          <Truncate
            lines={8}
            ellipsis={<ReadMoreButton onClick={expand}>Read more...</ReadMoreButton>}
          >
            <PostContent>{text}</PostContent>
          </Truncate>
        )}
      </Linkify>
      <Files files={files} />
      <EngagementBar />
    </PostContainer>
  );
};

export default customizableComponent('Post')(Post);
