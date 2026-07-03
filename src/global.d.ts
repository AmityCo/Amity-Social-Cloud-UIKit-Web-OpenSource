interface Window {
  __asc__?: Record<string, unknown>;
}

interface ImportMetaEnv {
  STORYBOOK_API_KEY: string;
  STORYBOOK_API_REGION: string;
  STORYBOOK_USER_1: string;
  STORYBOOK_USER_2: string;
  BASE_URL: string;
  STORYBOOK_SDK_REGION_STAGING: string;
  STORYBOOK_SDK_REGION_DEV: string;
  STORYBOOK_SDK_REGION_SG: string;
  STORYBOOK_SDK_REGION_EU: string;
  STORYBOOK_SDK_REGION_US: string;
  STORYBOOK_API_KEY_STAGING: string;
  STORYBOOK_API_KEY_DEV: string;
  STORYBOOK_API_KEY_SG: string;
  STORYBOOK_API_KEY_EU: string;
  STORYBOOK_API_KEY_US: string;
  STORYBOOK_UPLOAD_URL_STAGING: string;
  STORYBOOK_UPLOAD_URL_DEV: string;
  STORYBOOK_UPLOAD_URL_SG: string;
  STORYBOOK_UPLOAD_URL_EU: string;
  STORYBOOK_UPLOAD_URL_US: string;
  STORYBOOK_DEFAULT_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css';

declare module '*skeleton.css' {
  const classes: string;
  export default classes;
}

declare module '*.css?inline' {
  const classes: string;
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module 'colorthief' {
  export type RGBColor = [number, number, number];
  export default class ColorThief {
    getColor: (img: HTMLImageElement | null, quality: number = 10) => RGBColor | null;

    getPalette: (
      img: HTMLImageElement | null,
      colorCount: number = 10,
      quality: number = 10,
    ) => RGBColor[] | null;
  }
}
