import React from 'react';
import styles from './ImageCropper.module.css';
import MinusIcon from '~/v4/icons/MinusIcon';
import PlusIcon from '~/v4/icons/PlusIcon';

type Props = {
  zoom: number;
  minZoom: number;
  setZoom: (value: number) => void;
};

const ZoomSlider = ({ zoom, minZoom, setZoom }: Props) => {
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  return (
    <div className={styles.zoomControls}>
      <MinusIcon
        className={styles.zoomBtn}
        onClick={() => {
          setZoom(zoom - 0.1);
        }}
      />
      <input
        type="range"
        min={minZoom}
        max={5}
        step={0.01}
        value={zoom}
        onChange={handleZoomChange}
        className={styles.zoomSlider}
      />
      <PlusIcon
        className={styles.zoomBtn}
        onClick={() => {
          setZoom(zoom + 0.1);
        }}
      />
    </div>
  );
};

export default ZoomSlider;
