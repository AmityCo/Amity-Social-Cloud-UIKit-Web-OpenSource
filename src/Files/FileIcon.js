import React from 'react';

import defaultIcon from './icons/default.svg';
import audioIcon from './icons/audio.svg';
import aviIcon from './icons/avi.svg';
import csvIcon from './icons/csv.svg';
import docIcon from './icons/doc.svg';
import exeIcon from './icons/exe.svg';
import htmlIcon from './icons/html.svg';
import imgIcon from './icons/img.svg';
import movIcon from './icons/mov.svg';
import mp3Icon from './icons/mp3.svg';
import mp4Icon from './icons/mp4.svg';
import mpegIcon from './icons/mpeg.svg';
import pdfIcon from './icons/pdf.svg';
import pptIcon from './icons/ppt.svg';
import ppxIcon from './icons/ppx.svg';
import rarIcon from './icons/rar.svg';
import txtIcon from './icons/txt.svg';
import xlsIcon from './icons/xls.svg';
import zipIcon from './icons/zip.svg';

const extensionsToIconsMap = {
  audio: audioIcon,
  ogg: audioIcon,
  aac: audioIcon,
  avi: aviIcon,
  csv: csvIcon,
  doc: docIcon,
  exe: exeIcon,
  html: htmlIcon,
  jpg: imgIcon,
  png: imgIcon,
  gif: imgIcon,
  mov: movIcon,
  mp3: mp3Icon,
  mp4: mp4Icon,
  mpeg: mpegIcon,
  pdf: pdfIcon,
  ppt: pptIcon,
  pptx: pptIcon,
  ppx: ppxIcon,
  rar: rarIcon,
  txt: txtIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  zip: zipIcon,
};

const FileIcon = ({ file }) => {
  const extension = file.filename.split('.').slice(-1);
  const icon = extensionsToIconsMap[extension] || defaultIcon;
  return <img src={icon} alt={file.filename} />;
};

export default FileIcon;
