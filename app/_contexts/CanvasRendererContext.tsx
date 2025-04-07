"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CanvasRenderer } from "../_lib/CanvasRenderer";
import {
  AdjustmentParameters,
  Dimensions,
  Rotation,
  TransformParameters,
} from "../_lib/types";

export interface ICanvasRendererContext {
  adjustments: AdjustmentParameters;
  previewCanvasDimensions: Dimensions;
  render: () => void;
  createCanvasRenderer: (params: {
    canvas: HTMLCanvasElement;
    dimensions: Dimensions;
    pixelRatio: number;
  }) => void;
  setImage: (inputImage: ImageData | HTMLImageElement) => void;
  setAdjustments: (adjustments: AdjustmentParameters) => void;
}

const CanvasRendererContext = createContext<ICanvasRendererContext | null>(
  null
);

export const CanvasRendererProvider = ({ children }: PropsWithChildren) => {
  const [canvasRenderer, setCanvasRenderer] = useState<CanvasRenderer | null>(
    null
  );

  const [previewCanvasDimensions, setPreviewCanvasDimensions] =
    useState<Dimensions>({
      width: 0,
      height: 0,
    });
  const sourceDimensions = useRef<Dimensions>({
    width: 0,
    height: 0,
  });
  const previewDimensions = useRef<Dimensions>({
    width: 0,
    height: 0,
  });
  const previewPixelRatio = useRef<number>(1);

  const [adjustments, _setAdjustments] = useState<AdjustmentParameters>({
    brightness: 0,
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    warmth: 0,
    tint: 0,
    saturation: 0,
    sharpness: 0,
    grain: 0,
    vignette: 0,
  });
  const [transform] = useState<TransformParameters>({
    rotation: Rotation["0deg"],
    adjust: 0,
    cx: 0.5,
    cy: 0.5,
    dx: 1,
    dy: 1,
  });

  const scheduledRender = useRef(false);
  const scheduledRenderAdjustments = useRef<AdjustmentParameters>(adjustments);
  const scheduledRenderTransform = useRef<TransformParameters>(transform);

  const createCanvasRenderer = useCallback(
    (params: {
      canvas: HTMLCanvasElement;
      dimensions: Dimensions;
      pixelRatio: number;
    }): void => {
      const { canvas, dimensions, pixelRatio } = params;
      const canvasRendererInstance = new CanvasRenderer(canvas);
      setCanvasRenderer(canvasRendererInstance);

      previewDimensions.current = dimensions;
      previewPixelRatio.current = pixelRatio;
    },
    []
  );

  const render = useCallback(() => {
    if (canvasRenderer?.getState() !== "ready") return;

    const outputDimensions = {
      width: Math.round(sourceDimensions.current.width * transform.dx),
      height: Math.round(sourceDimensions.current.height * transform.dy),
    };

    const heightRatio =
      previewDimensions.current.height / outputDimensions.height;
    const widthRatio = previewDimensions.current.width / outputDimensions.width;
    const canvasScaleFactor = Math.min(1, heightRatio, widthRatio);

    const subsamplingRatio = 1 / canvasScaleFactor / previewPixelRatio.current;
    const canvasDimensions: Dimensions = {
      width: Math.round(outputDimensions.width * canvasScaleFactor),
      height: Math.round(outputDimensions.height * canvasScaleFactor),
    };

    const renderDimensions = {
      width: Math.round(
        (sourceDimensions.current.width * transform.dx) / subsamplingRatio
      ),
      height: Math.round(
        (sourceDimensions.current.height * transform.dy) / subsamplingRatio
      ),
    };

    setPreviewCanvasDimensions(canvasDimensions);
    canvasRenderer.render({
      sourceDimensions: sourceDimensions.current,
      renderDimensions,
      adjustments: scheduledRenderAdjustments.current,
      transform: scheduledRenderTransform.current,
    });
  }, [canvasRenderer, sourceDimensions, transform.dx, transform.dy]);

  const scheduleRender = useCallback(
    (adjustments: AdjustmentParameters, transform: TransformParameters) => {
      scheduledRenderAdjustments.current = adjustments;
      scheduledRenderTransform.current = transform;

      if (!scheduledRender.current) {
        requestAnimationFrame(() => {
          render();
          scheduledRender.current = false;
        });
      }
    },
    [scheduledRender, scheduledRenderAdjustments, render]
  );

  const setImage = useCallback(
    (inputImage: ImageData | HTMLImageElement) => {
      if (inputImage instanceof ImageData) {
        sourceDimensions.current = {
          width: inputImage.width,
          height: inputImage.height,
        };
      }

      if (inputImage instanceof HTMLImageElement) {
        sourceDimensions.current = {
          width: inputImage.naturalWidth,
          height: inputImage.naturalHeight,
        };
      }

      canvasRenderer?.setImage(inputImage);
      scheduleRender(adjustments, transform);
    },
    [adjustments, canvasRenderer, scheduleRender, transform]
  );

  const setAdjustments = useCallback(
    (adjustments: AdjustmentParameters) => {
      _setAdjustments(adjustments);
      scheduleRender(adjustments, transform);
    },
    [scheduleRender, transform]
  );

  return (
    <CanvasRendererContext.Provider
      value={{
        adjustments,
        previewCanvasDimensions,
        render,
        createCanvasRenderer,
        setImage,
        setAdjustments,
      }}
    >
      {children}
    </CanvasRendererContext.Provider>
  );
};

export const useCanvasRendererContext = () => {
  const ctx = useContext(CanvasRendererContext);
  if (!ctx) throw new Error(`can't found canvas renderer provider`);
  return ctx;
};
