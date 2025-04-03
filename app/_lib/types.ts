export type Dimensions = {
  width: number;
  height: number;
};

export enum Rotation {
  "0deg" = 0,
  "90deg" = 90,
  "180deg" = 180,
  "270deg" = 270,
}

export type CropParameters = {
  cx: number;
  cy: number;
  dx: number;
  dy: number;
};

export type TransformParameters = CropParameters & {
  rotation: Rotation;
  adjust: number;
};

export type AdjustmentParameters = {
  brightness: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  warmth: number;
  tint: number;
  saturation: number;
  sharpness: number;
  grain: number;
  vignette: number;
};
