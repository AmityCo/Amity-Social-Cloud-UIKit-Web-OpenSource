import React, { useState } from 'react';
import PropTypes from 'prop-types';

import GalleryGrid from '~/core/components/GalleryGrid';
import ImageGallery from '~/core/components/ImageGallery';
import Image from '~/core/components/Uploaders/Image';

const GalleryContent = ({ items }) => {
  const [index, setIndex] = useState(null);

  return (
    <>
      <GalleryGrid items={items} onClick={setIndex} truncate>
        {item =>
          item && <Image key={item.data.fileId} fileId={item.data.fileId} imageFit="cover" />
        }
      </GalleryGrid>

      {index !== null && (
        <ImageGallery index={index} items={items} onChange={setIndex}>
          {item =>
            item && (
              <Image key={item.data.fileId} fileId={item.data.fileId} imageFit="contain" noBorder />
            )
          }
        </ImageGallery>
      )}
    </>
  );
};

GalleryContent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GalleryContent;
