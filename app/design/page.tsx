"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Slider } from "../_components/Slider";
import { SUPPORTED_MIME_TYPES } from "../_constants/file";
import { useCanvasRendererContext } from "../_contexts/CanvasRendererContext";
import { usePreviewImg } from "../_hooks/usePreviewImage";

enum AdjustmentType {
  BRIGHTNESS = "brightness",
  EXPOSURE = "exposure",
  CONTRAST = "contrast",
  HIGHLIGHTS = "highlights",
  SHADOWS = "shadows",
  SATURATION = "saturation",
}

const ADJUSTMENT_TYPE_RESOURCES = {
  [AdjustmentType.BRIGHTNESS]: "밝기",
  [AdjustmentType.EXPOSURE]: "노출",
  [AdjustmentType.CONTRAST]: "대비",
  [AdjustmentType.HIGHLIGHTS]: "하이라이트",
  [AdjustmentType.SHADOWS]: "섀도우",
  [AdjustmentType.SATURATION]: "채도",
} as const satisfies { [key in AdjustmentType]: string };

export default function DesignPage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const {
    adjustments,
    render,
    createCanvasRenderer,
    setImage,
    setAdjustments,
  } = useCanvasRendererContext();

  const [tab, setTab] = useState(AdjustmentType.BRIGHTNESS);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageDataUrl = usePreviewImg(imageFile);

  const handleImageUploadClick = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const handleUploadImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = evt.target.files?.[0];
    if (!imgFile) return;
    setImageFile(imgFile);
  };

  const handleDownloadImage = () => {
    render();
    const dataUrl = canvasRef.current?.toDataURL(imageFile?.type);
    if (!dataUrl) return;

    const aElement = document.createElement("a");
    aElement.download = `${uuidv4()}.${imageFile?.type.split("/")[1]}`;
    aElement.href = dataUrl;

    aElement.click();
  };

  const onLoadImage = () => {
    if (!canvasRef.current || !imageRef.current) return;
    setImage(imageRef.current);
  };

  const handleTab = (tab: AdjustmentType) => () => {
    setTab(tab);
  };

  const handleAdjustment = (value: number, type: AdjustmentType) => {
    setAdjustments({ ...adjustments, [type]: value });
  };

  useEffect(() => {
    if (!imageDataUrl) return;
    if (!canvasRef.current || !canvasContainerRef.current) return;
    const devicePixelRatio = window.devicePixelRatio || 1;
    createCanvasRenderer({
      canvas: canvasRef.current,
      pixelRatio: devicePixelRatio,
      dimensions: {
        width: canvasContainerRef.current.clientWidth,
        height: canvasContainerRef.current.clientHeight,
      },
    });
  }, [imageDataUrl]);

  return (
    <div className="w-full min-h-screen">
      <header className="pt-10 md:pt-20 flex justify-center">
        <div className="flex w-[320px] md:w-[480px] gap-4 flex-col md:flex-row items-center md:items-start">
          <img
            src="/logo.webp"
            className="flex-[0_0_160px] w-[160px] h-[160px] rounded-2xl"
            alt="lumi art"
          />
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-br from-violet-700 to-purple-400/20 bg-clip-text">
              Lumi Art
            </h2>
            <p>
              다양한 필터와 효과로 사진을 예술적으로 바꿔보세요.
              <br />
              <span className="font-bold">LumiArt</span>는 빠르고 직관적인 편집
              도구를 통해 일상 이미지를 특별하게 만들어 줍니다.
            </p>
          </div>
        </div>
      </header>
      <main className="mt-8 flex flex-col items-center">
        {imageDataUrl && (
          <section className="flex flex-col items-center">
            <div className="w-[320px] md:w-[480px] py-2 flex gap-2 overflow-auto">
              {Object.values(AdjustmentType).map((AdjustmentType) => (
                <button
                  key={`adjustment-tab-${AdjustmentType}`}
                  className={clsx(
                    "w-24 flex-shrink-0 text-center p-2 rounded  font-bold text-white bg-violet-400",
                    tab === AdjustmentType && "bg-violet-700",
                    tab !== AdjustmentType && "hover:bg-violet-500"
                  )}
                  onClick={handleTab(AdjustmentType)}
                >
                  {ADJUSTMENT_TYPE_RESOURCES[AdjustmentType]}
                </button>
              ))}
            </div>
            <div className="mt-4 w-[320px]  md:w-[480px] flex flex-col gap-8">
              {tab === AdjustmentType.BRIGHTNESS && (
                <>
                  <Slider
                    value={[adjustments.brightness]}
                    max={1}
                    min={-1}
                    step={0.01}
                    onValueChange={([value]) =>
                      handleAdjustment(value, AdjustmentType.BRIGHTNESS)
                    }
                  />
                  {/* <div>
                    <span className="text-red-600">RED</span>
                    <Slider
                      value={[rBrightness]}
                      max={100}
                      step={1}
                      onValueChange={([r]) => setRBrightness(r)}
                    />
                  </div>
                  */}
                </>
              )}
              {tab === AdjustmentType.EXPOSURE && (
                <Slider
                  value={[adjustments.exposure]}
                  max={1}
                  min={-1}
                  step={0.01}
                  onValueChange={([value]) =>
                    handleAdjustment(value, AdjustmentType.EXPOSURE)
                  }
                />
              )}
              {tab === AdjustmentType.CONTRAST && (
                <Slider
                  value={[adjustments.contrast]}
                  max={1}
                  min={-1}
                  step={0.01}
                  onValueChange={([value]) =>
                    handleAdjustment(value, AdjustmentType.CONTRAST)
                  }
                />
              )}
              {tab === AdjustmentType.HIGHLIGHTS && (
                <Slider
                  value={[adjustments.highlights]}
                  max={0}
                  min={-1}
                  step={0.01}
                  onValueChange={([value]) =>
                    handleAdjustment(value, AdjustmentType.HIGHLIGHTS)
                  }
                />
              )}
              {tab === AdjustmentType.SHADOWS && (
                <Slider
                  value={[adjustments.shadows]}
                  max={1}
                  min={0}
                  step={0.01}
                  onValueChange={([value]) =>
                    handleAdjustment(value, AdjustmentType.SHADOWS)
                  }
                />
              )}
              {tab === AdjustmentType.SATURATION && (
                <Slider
                  value={[adjustments.saturation]}
                  max={1}
                  min={-1}
                  step={0.01}
                  onValueChange={([value]) =>
                    handleAdjustment(value, AdjustmentType.SATURATION)
                  }
                />
              )}
            </div>
          </section>
        )}

        <section className="my-8 flex gap-4">
          <button
            className="w-[320px] md:w-[480px] min-h-[360px] p-8 flex justify-center items-center rounded-xl border-[2.5px] border-dashed border-purple-600"
            onClick={handleImageUploadClick}
          >
            {imageDataUrl ? (
              <div
                ref={canvasContainerRef}
                style={{
                  width: "480px",
                }}
              >
                <img
                  ref={imageRef}
                  className="w-full h-full hidden"
                  src={imageDataUrl}
                  alt="target-image"
                  onLoad={onLoadImage}
                />
                <canvas className="w-full h-full" ref={canvasRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 ">
                <ImageIcon height={40} width={40} color="#9333ea" />
                <p className="text-purple-700  text-xs">
                  이미지를 업로드해보세요!
                </p>
              </div>
            )}
          </button>

          <input
            className="hidden"
            ref={imageInputRef}
            type="file"
            onChange={handleUploadImage}
          />
        </section>
        {imageDataUrl &&
          SUPPORTED_MIME_TYPES.includes(imageFile?.type ?? "") && (
            <section className="mt-4 mb-10">
              <button
                className="w-[320px] md:w-[480px] p-4 bg-violet-700 rounded-lg font-bold text-white"
                onClick={handleDownloadImage}
              >
                내보내기
              </button>
            </section>
          )}
      </main>
    </div>
  );
}
