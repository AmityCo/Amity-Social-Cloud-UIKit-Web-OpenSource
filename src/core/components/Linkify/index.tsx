import React from 'react';
import Linkify from 'linkify-react';

import { Link } from './styles';

type UiKitLinkifyProps = Omit<React.ComponentProps<typeof Linkify>, 'componentDecorator'>;

const UiKitLinkify = (props: UiKitLinkifyProps) => (
  <Linkify
    {...props}
    options={{
      render: ({ attributes, content }) => {
        const { href, ...props } = attributes;
        return (
          <Link target="blank" rel="noopener noreferrer" href={href} {...props}>
            {content}
          </Link>
        );
      },
    }}
  />
);

export default UiKitLinkify;
