import { useEffect, useState } from 'react';
import { isMobile } from '~/v4/social/utils/isMobile';
import { FileItem } from './useFilePostUpload';
import { isImageFile, isVideoFile } from '~/v4/utils/checkFileType';
import { PostContentType } from '@amityco/ts-sdk';

//handle snap change based on visible menu items

export const useMediaAttachmentVisible = ({
  files, // Incoming media
  posts, // Remaining media
}: {
  files?: FileItem[];
  posts?: Amity.Post[];
}) => {
  const HEIGHT_MEDIA_ATTACHMENT_MENU = '6.75rem';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 = '8.5rem';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 = '11rem';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3 = '14.5rem';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_4 = '18.1rem';

  const [snap, setSnap] = useState<string>(HEIGHT_MEDIA_ATTACHMENT_MENU);
  const [isVisibleCamera, setIsVisibleCamera] = useState(false);
  const [isVisibleImage, setIsVisibleImage] = useState(true);
  const [isVisibleVideo, setIsVisibleVideo] = useState(true);
  const [isVisibleFile, setIsVisibleFile] = useState(true);

  const isShowDetailMediaAttachmentMenu =
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_4;

  const handleSnapChange = (newSnap: string) => {
    if (snap === HEIGHT_MEDIA_ATTACHMENT_MENU && newSnap === '0px') {
      return;
    }
    setSnap(newSnap);
  };

  // Set camera visibility based on mobile detection
  useEffect(() => {
    setIsVisibleCamera(isMobile());
  }, []);

  useEffect(() => {
    // Handle case when there are no files or posts
    if (!files?.length && !posts?.length) {
      // Case 1: No files - show all options
      setIsVisibleImage(true);
      setIsVisibleVideo(true);
      setIsVisibleFile(true);
    } else if (
      posts?.some((post) => post.dataType === PostContentType.IMAGE) ||
      files?.some((file) => isImageFile(file))
    ) {
      // Case 2: Image files - show camera and image
      setIsVisibleImage(true);
      setIsVisibleVideo(false);
      setIsVisibleFile(false);
    } else if (
      posts?.some((post) => post.dataType === PostContentType.VIDEO) ||
      files?.some((file) => isVideoFile(file))
    ) {
      // Case 3: Video files - show camera and video
      setIsVisibleImage(false);
      setIsVisibleVideo(true);
      setIsVisibleFile(false);
    } else {
      // Case 4: Other files - show only file
      setIsVisibleImage(false);
      setIsVisibleVideo(false);
      setIsVisibleFile(true);
    }
  }, [files, posts]);

  // Update snap position based on visible menu items
  useEffect(() => {
    // Count visible buttons (excluding camera which has different layout considerations)
    const visibleCount = [isVisibleCamera, isVisibleImage, isVisibleVideo, isVisibleFile].filter(
      Boolean,
    ).length;
    if (visibleCount === 4) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_4);
    } else if (visibleCount === 3) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3);
    } else if (visibleCount === 2) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2);
    } else if (visibleCount === 1) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1);
    }
  }, [isVisibleCamera, isVisibleImage, isVisibleVideo, isVisibleFile]);

  const showToastPosition = () => {
    //TODO : Change default to 4 when visible file post
    switch (snap) {
      case HEIGHT_MEDIA_ATTACHMENT_MENU:
        return '0';
      case HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1:
        return '1';
      case HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2:
        return '2';
      case HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3:
        return '3';
      // case HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_4:
      //   return '4';
      default:
        return '3';
    }
  };

  return {
    isShowDetailMediaAttachmentMenu,
    snap,
    isVisibleCamera,
    isVisibleImage,
    isVisibleVideo,
    isVisibleFile,
    HEIGHT_MEDIA_ATTACHMENT_MENU,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_4,
    handleSnapChange,
    showToastPosition,
  };
};
