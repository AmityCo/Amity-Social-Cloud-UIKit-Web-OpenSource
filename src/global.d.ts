interface Window {
  __asc__?: Record<string, unknown>;
}

interface ImportMetaEnv {
  STORYBOOK_API_KEY: string;
  STORYBOOK_API_REGION: string;
  STORYBOOK_USER_1: string;
  STORYBOOK_USER_2: string;
  BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
