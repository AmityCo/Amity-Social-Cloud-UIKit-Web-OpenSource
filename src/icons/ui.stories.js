import React from 'react';
import * as Icons from '.';

export default {
  title: 'Assets/Icons',
};

export const Category = () => <Icons.Category />;
export const Community = () => <Icons.Community />;
export const User = () => <Icons.User />;
export const EmptyFeed = () => <Icons.EmptyFeed />;

export const ChevronDown = () => <Icons.ChevronDown />;
export const Sky = () => <Icons.Sky />;
export const Balloon = () => <Icons.Balloon />;
export const Dots = () => <Icons.Dots />;

export const Plus = () => <Icons.Plus />;
export const Remove = () => <Icons.Remove />;

export const Files = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridAutoRows: '4em',
      gridGap: '1em',
    }}
  >
    <Icons.AudioFile />
    <Icons.AviFile />
    <Icons.CsvFile />
    <Icons.DefaultFile />
    <Icons.DocFile />
    <Icons.ExeFile />
    <Icons.HtmlFile />
    <Icons.ImgFile />
    <Icons.MovFile />
    <Icons.Mp3File />
    <Icons.Mp4File />
    <Icons.MpegFile />
    <Icons.PdfFile />
    <Icons.PptFile />
    <Icons.PpxFile />
    <Icons.RarFile />
    <Icons.TxtFile />
    <Icons.XlsFile />
    <Icons.ZipFile />
  </div>
);
