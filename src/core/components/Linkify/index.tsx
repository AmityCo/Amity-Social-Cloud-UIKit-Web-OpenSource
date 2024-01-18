import React from 'react';
import Linkify from 'linkify-react';

import { Link } from './styles';

type UiKitLinkifyProps = Omit<React.ComponentProps<typeof Linkify>, 'componentDecorator'>;

const UiKitLinkify = (props: UiKitLinkifyProps) => (
  <Linkify
    componentDecorator={(decoratedHref?: string, decoratedText?: string, key?: string) => (
      <Link key={key} target="blank" rel="noopener noreferrer" href={decoratedHref}>
        {decoratedText}
      </Link>
    )}
    {...props}
  />
);

export default UiKitLinkify;
