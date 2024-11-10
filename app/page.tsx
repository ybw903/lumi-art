"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

import { usePreviewImg } from "./_hooks/usePreviewImage";
import { Slider } from "./_components/Slider";
import {
  getOffset,
  gammaBrightness,
  linearContrast,
  linearSaturation,
} from "./_utils/images";

enum TAB_TYPE {
  BRIGHTNESS,
  CONTRAST,
  SATURATION,
}

export default function Home() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [tab, setTab] = useState(TAB_TYPE.BRIGHTNESS);
  const [canvasImgData, setCanvasImageData] = useState<ImageData | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageDataUrl = usePreviewImg(imageFile);

  const [brightnessCoefficient, setBrightnessCoefficient] = useState(1);
  const [contrastCoefficient, setContrastCoefficient] = useState(1);
  const [saturationCoefficient, setSaturationCoefficient] = useState(1);

  const handleImageUploadClick = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const handleUploadImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = evt.target.files?.[0];
    if (!imgFile) return;
    setImageFile(imgFile);
  };

  const onLoadImage = () => {
    if (!canvasRef.current || !imageRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) return;
    canvasRef.current.width = imageRef.current.width;
    canvasRef.current.height = imageRef.current.height;
    setImgWidth(imageRef.current.width);
    setImgHeight(imageRef.current.height);

    ctx.drawImage(imageRef.current, 0, 0);

    const imageData = ctx.getImageData(
      0,
      0,
      imageRef.current.width,
      imageRef.current.height
    );
    setCanvasImageData(imageData);
  };

  const handleTab = (tab: TAB_TYPE) => () => {
    setTab(tab);
  };

  const processImage = () => {
    if (!canvasRef.current || !canvasImgData) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const orgImageData = [...canvasImgData.data];

    for (let y = 0; y < canvasRef.current.height; y++) {
      for (let x = 0; x < canvasRef.current.width; x++) {
        const offset = getOffset(x, y, canvasRef.current.width);

        const r = orgImageData[offset];
        const g = orgImageData[offset + 1];
        const b = orgImageData[offset + 2];

        const grayScale = (r + g + b) / 3;

        imageData.data[offset] = linearSaturation(
          linearContrast(
            gammaBrightness(r, brightnessCoefficient),
            contrastCoefficient
          ),
          saturationCoefficient,
          grayScale
        );
        imageData.data[offset + 1] = linearSaturation(
          linearContrast(
            gammaBrightness(g, brightnessCoefficient),
            contrastCoefficient
          ),
          saturationCoefficient,
          grayScale
        );
        imageData.data[offset + 2] = linearSaturation(
          linearContrast(
            gammaBrightness(b, brightnessCoefficient),
            contrastCoefficient
          ),
          saturationCoefficient,
          grayScale
        );
        imageData.data[offset + 3] = orgImageData[offset + 3];
      }
    }
    ctx?.putImageData(imageData, 0, 0);
  };

  const handleBrightness = (coefficient: number) => {
    setBrightnessCoefficient(coefficient);
    if (!canvasRef.current || !canvasImgData) return;
    processImage();
  };

  const handleContrast = (coefficient: number) => {
    setContrastCoefficient(coefficient);
    processImage();
  };

  const handleSaturation = (coefficient: number) => {
    setSaturationCoefficient(coefficient);
    processImage();
  };

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
            <div className="w-[320px] md:w-[480px] p-2 flex gap-2 ">
              <button
                className={clsx(
                  "flex-1 text-center p-2 rounded  font-bold text-white bg-violet-400",
                  tab === TAB_TYPE.BRIGHTNESS && "bg-violet-700",
                  tab !== TAB_TYPE.BRIGHTNESS && "hover:bg-violet-500"
                )}
                onClick={handleTab(TAB_TYPE.BRIGHTNESS)}
              >
                밝기
              </button>
              <button
                className={clsx(
                  "flex-1 text-center p-2 rounded  font-bold text-white  bg-violet-400",
                  tab === TAB_TYPE.CONTRAST && "bg-violet-700",
                  tab !== TAB_TYPE.CONTRAST && "hover:bg-violet-500"
                )}
                onClick={handleTab(TAB_TYPE.CONTRAST)}
              >
                대비
              </button>
              <button
                className={clsx(
                  "flex-1 text-center p-2 rounded  font-bold text-white bg-violet-400 ",
                  tab === TAB_TYPE.SATURATION && "bg-violet-700",
                  tab !== TAB_TYPE.SATURATION && "hover:bg-violet-500"
                )}
                onClick={handleTab(TAB_TYPE.SATURATION)}
              >
                채도
              </button>
            </div>
            <div className="mt-4 w-[320px]  md:w-[480px] flex flex-col gap-8">
              {tab === TAB_TYPE.BRIGHTNESS && (
                <>
                  <Slider
                    value={[brightnessCoefficient]}
                    max={2}
                    min={0}
                    step={0.01}
                    onValueChange={([value]) => handleBrightness(value)}
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
              {tab === TAB_TYPE.CONTRAST && (
                <Slider
                  value={[contrastCoefficient]}
                  max={2}
                  min={0}
                  step={0.01}
                  onValueChange={([value]) => handleContrast(value)}
                />
              )}
              {tab === TAB_TYPE.SATURATION && (
                <Slider
                  value={[saturationCoefficient]}
                  max={2}
                  min={0}
                  step={0.01}
                  onValueChange={([value]) => handleSaturation(value)}
                />
              )}
            </div>
          </section>
        )}

        <div className="my-8 flex gap-4">
          <button
            className="w-[320px] md:w-[480px] min-h-[360px] p-8 flex justify-center items-center rounded-xl border-[2.5px] border-dashed border-purple-600"
            onClick={handleImageUploadClick}
          >
            {imageDataUrl ? (
              <div
                style={{
                  width: "480px",
                  height: `${(imgHeight / imgWidth) * 480}px`,
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
        </div>
      </main>
    </div>
  );
}
