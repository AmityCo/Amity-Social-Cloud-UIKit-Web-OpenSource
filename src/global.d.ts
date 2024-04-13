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

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
