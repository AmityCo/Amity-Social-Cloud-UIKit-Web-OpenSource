import React from 'react';
import * as Icons from '.';

export default {
  title: 'Assets/Icons',
};

export const Bars = () => <Icons.BarsIcon />;
export const Category = () => <Icons.Category />;
export const Community = () => <Icons.Community />;
export const CommunityAlt = () => <Icons.CommunityAlt />;
export const User = () => <Icons.User />;
export const EmptyFeed = () => <Icons.EmptyFeed />;
export const EmptyImageGallery = () => <Icons.EmptyImageGallery />;
export const EmptyLivestreamGallery = () => <Icons.EmptyLivestreamGallery />;
export const EmptyVideoGallery = () => <Icons.EmptyVideoGallery />;
export const Tab = () => <Icons.Tab />;
export const UnknownPost = () => <Icons.UnknownPost />;
export const Pending = () => <Icons.Pending />;
export const MagicWand = () => <Icons.MagicWand />;
export const Minus = () => <Icons.Minus />;
export const Poll = () => <Icons.Poll />;
export const CircleRemove = () => <Icons.CircleRemove />;

export const Camera = () => <Icons.Camera />;
export const Check = () => <Icons.Check />;
export const ChevronDown = () => <Icons.ChevronDown />;
export const ChevronLeft = () => <Icons.ChevronLeft />;
export const ChevronRight = () => <Icons.ChevronRight />;
export const Close = () => <Icons.Close />;
export const Comment = () => <Icons.Comment />;
export const CreateChat = () => <Icons.CreateChat />;
export const EllipsisH = () => <Icons.EllipsisH />;
export const EllipsisV = () => <Icons.EllipsisV />;
export const ExclamationCircle = () => <Icons.ExclamationCircle />;
export const Globe = () => <Icons.Globe />;
export const Sky = () => <Icons.Sky />;
export const Balloon = () => <Icons.Balloon />;
export const Dots = () => <Icons.Dots />;
export const LivestreamCover = () => <Icons.LivestreamCover />;
export const CommunityCoverPicture = () => <Icons.CommunityCoverPicture />;
export const Lock = () => <Icons.Lock />;
export const Message = () => <Icons.Message />;
export const MinusCirlce = () => <Icons.MinusCircle />;
export const Newspaper = () => <Icons.Newspaper />;
export const NewspaperLight = () => <Icons.NewspaperLight />;
export const Play = () => <Icons.Play />;
export const Plus = () => <Icons.Plus />;
export const Pencil = () => <Icons.Pencil />;
export const Remove = () => <Icons.Remove />;
export const Reply = () => <Icons.Reply />;
export const Search = () => <Icons.Search />;
export const SendMessage = () => <Icons.SendMessage />;
export const ImageAttachment = () => <Icons.ImageAttachment />;
export const VideoAttachment = () => <Icons.VideoAttachment />;
export const FileAttachment = () => <Icons.FileAttachment />;
export const Save = () => <Icons.Save />;
export const Shield = () => <Icons.Shield />;
export const SortDown = () => <Icons.SortDown />;
export const ThumbsUp = () => <Icons.ThumbsUp />;
export const Trash = () => <Icons.Trash />;
export const Verified = () => <Icons.Verified />;

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
