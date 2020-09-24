import React from 'react';
import * as Icons from '.';

export default {
  title: 'Components/Icons',
  parameters: { layout: 'centered' },
};

export const User = () => <Icons.User />;

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
