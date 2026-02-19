export const enum DisplayModeEnum {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
}

export type DisplayMode = `${DisplayModeEnum}`;

export const enum ProductTagListRenderModeEnum {
  POST = 'post',
  LIVESTREAM = 'livestream',
  IMAGE = 'image',
  VIDEO = 'video',
}

export type ProductTagListRenderMode = `${ProductTagListRenderModeEnum}`;

export const enum LayoutVariantEnum {
  LIST = 'list',
  CARD = 'card',
}

export type LayoutVariant = `${LayoutVariantEnum}`;
