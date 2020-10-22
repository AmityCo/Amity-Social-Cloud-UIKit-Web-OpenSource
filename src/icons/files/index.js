import React from 'react';

import DefaultFile from './Default';

import AudioFile from './Audio';
import AviFile from './Avi';
import CsvFile from './Csv';
import DocFile from './Doc';
import ExeFile from './Exe';
import HtmlFile from './Html';
import ImgFile from './Img';
import MovFile from './Mov';
import Mp3File from './Mp3';
import Mp4File from './Mp4';
import MpegFile from './Mpeg';
import PdfFile from './Pdf';
import PptFile from './Ppt';
import PpxFile from './Ppx';
import RarFile from './Rar';
import TxtFile from './Txt';
import XlsFile from './Xls';
import ZipFile from './Zip';

const MAPPING = {
  aac: AudioFile,
  avi: AviFile,
  csv: CsvFile,
  doc: DocFile,
  exe: ExeFile,
  gif: ImgFile,
  html: HtmlFile,
  jpg: ImgFile,
  mov: MovFile,
  mp3: Mp3File,
  mp4: Mp4File,
  mpeg: MpegFile,
  ogg: AudioFile,
  pdf: PdfFile,
  ppt: PptFile,
  pptx: PptFile,
  ppx: PpxFile,
  png: ImgFile,
  rar: RarFile,
  txt: TxtFile,
  xls: XlsFile,
  xlsx: XlsFile,
  zip: ZipFile,

  audio: AudioFile,
  image: ImgFile,
  video: MpegFile,
};

const FileIcon = ({ file, ...props }) => {
  const { name, type } = file;

  const extension = Object.keys(MAPPING).find(marker => {
    return type.includes(marker) || name.endsWith(`.${marker}`);
  });

  const Icon = MAPPING[extension] || DefaultFile;
  return <Icon {...props} />;
};

export default FileIcon;
