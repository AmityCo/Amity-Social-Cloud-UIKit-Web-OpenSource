import React from 'react';
import Linkify from 'linkify-react';

import { Link } from './styles';

const hrefDecorator = (decoratedHref, decoratedText, key) => (
  <Link key={key} target="blank" rel="noopener noreferrer" href={decoratedHref}>
    {decoratedText}
  </Link>
);

const UiKitLinkify = (props) => <Linkify componentDecorator={hrefDecorator} {...props} />;

export default UiKitLinkify;
