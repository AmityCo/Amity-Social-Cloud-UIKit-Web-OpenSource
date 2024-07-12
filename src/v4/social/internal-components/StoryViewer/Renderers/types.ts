import Stories from 'react-insta-stories';

import React from 'react';

type StoriesProps = React.ComponentProps<typeof Stories>;

export type RendererObject = NonNullable<StoriesProps['renderers']>[number];

export type RendererProps = React.ComponentProps<RendererObject['renderer']>;
export type Renderer = RendererObject['renderer'];
type TesterProp = RendererObject['tester'];

export type Tester = (story: CustomStory) => ReturnType<TesterProp>;

type Action = RendererProps['action'];
type Story = RendererProps['story'];

export type CustomStory = Story & { story?: Amity.Story; ad?: Amity.Ad } & {
  actions: Array<{
    name: string;
    action: () => void;
    icon: JSX.Element;
  }>;
  onChange: (file: File) => void;
  handleAddIconClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  addStoryButton: JSX.Element;
  fileInputRef: React.RefObject<HTMLInputElement>;
  storyStyles: {
    background: string;
  };
  currentIndex: number;
  storiesCount: number;
  increaseIndex: () => void;
  pageId?: string;
  dragEventTarget?: React.RefObject<HTMLElement>;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBottomSheetOpen: boolean;
};

export type CustomRendererProps = RendererProps & {
  story: CustomStory;
  config: {
    width?: number | string;
    height?: number | string;
    loader?: JSX.Element;
    header?: () => JSX.Element;
    storyStyles?: object;
  };
  onClose: () => void;
  onSwipeDown?: () => void;
  onClickCommunity?: () => void;
  messageHandler: (
    type: string,
    data: any,
  ) => {
    ack: 'OK' | 'ERROR';
  };
};

export type CustomRenderer = React.FC<CustomRendererProps>;
