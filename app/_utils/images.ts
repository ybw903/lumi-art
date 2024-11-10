export const getOffset = (x: number, y: number, w: number) => (y * w + x) * 4;

export const linearBrightness = (pixel: number, coefficient: number) =>
  pixel * coefficient;

export const gammaBrightness = (pixel: number, coefficient: number) =>
  255 * Math.pow(pixel / 255, 2 - coefficient);

export const linearContrast = (pixel: number, coefficient: number) =>
  255 * ((pixel / 255 - 0.5) * coefficient + 0.5);

export const sigmoidContrast = (pixel: number, coefficient: number) =>
  255 / (1 + Math.exp(-coefficient * (pixel / 255 - 0.5)));

export const linearSaturation = (
  pixel: number,
  coefficient: number,
  grayScale: number
) => pixel * coefficient + grayScale * (1 - coefficient);
