import React from 'react';
import Linkify from 'react-linkify';

import { Link } from './styles';

const hrefDecorator = (decoratedHref, decoratedText, key) => (
  <Link target="blank" rel="noopener noreferrer" href={decoratedHref} key={key}>
    {decoratedText}
  </Link>
);

const UiKitLinkify = props => <Linkify componentDecorator={hrefDecorator} {...props} />;

export default UiKitLinkify;
