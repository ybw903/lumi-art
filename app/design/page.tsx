"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Slider } from "../_components/Slider";
import { SUPPORTED_MIME_TYPES } from "../_constants/file";
import { useCanvasRendererContext } from "../_contexts/CanvasRendererContext";
import { usePreviewImg } from "../_hooks/usePreviewImage";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../_components/Sheet";
import { useViewSize } from "../_hooks/useViewSize";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../_components/Drawer";

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

  const { isDesktop, isMobile } = useViewSize();

  const [openedAdjustmentPanel, setOpenedAdjustmentPanel] = useState(false);
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
    setOpenedAdjustmentPanel(true);
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
    <div className="w-full flex justify-center items-center min-h-screen">
      {isDesktop && openedAdjustmentPanel && (
        <aside className="w-[360px]">
          <Sheet
            defaultOpen={true}
            open={openedAdjustmentPanel}
            onOpenChange={setOpenedAdjustmentPanel}
            modal={false}
          >
            <SheetContent
              side={"left"}
              onPointerDownOutside={(evt) => evt.preventDefault()}
              onInteractOutside={(evt) => evt.preventDefault()}
            >
              <SheetHeader>
                <SheetTitle>조정</SheetTitle>
                <SheetDescription className="hidden">
                  이미지 필터를 적용합니다.
                </SheetDescription>
              </SheetHeader>

              {imageDataUrl && (
                <section className="flex flex-col">
                  <div className="w-full py-2 flex gap-2  overflow-auto">
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
                  <div className="w-full flex flex-col py-4">
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
            </SheetContent>
          </Sheet>
        </aside>
      )}
      {isMobile && openedAdjustmentPanel && (
        <Drawer
          open={openedAdjustmentPanel}
          onOpenChange={setOpenedAdjustmentPanel}
          modal={false}
        >
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>조정</DrawerTitle>
                <DrawerDescription className="hidden">
                  이미지 필터를 적용합니다.
                </DrawerDescription>
              </DrawerHeader>
              {imageDataUrl && (
                <section className="flex flex-col px-4">
                  <div className="w-full py-2 flex gap-2 overflow-auto">
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
                  <div className="w-full flex flex-col py-4">
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
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <main
        className={clsx(
          "mt-8 flex flex-col items-center",
          isDesktop && openedAdjustmentPanel && "w-[100%-360px]"
        )}
      >
        <section className="my-8 flex gap-4 relative">
          {imageDataUrl && !openedAdjustmentPanel && (
            <div
              className={clsx(
                "absolute top-[-48px] py-2 px-2.5 rounded-xl bg-white shadow-md"
              )}
            >
              <button
                className="flex items-center cursor-pointer"
                onClick={() => setOpenedAdjustmentPanel(true)}
              >
                <ImageIcon size={14} />
                <span className="ml-1 text-xs font-bold">편집</span>
              </button>
            </div>
          )}

          <button
            className="w-[320px] md:w-[480px] min-h-[360px] p-8 flex justify-center items-center rounded-xl border-[2.5px] border-dashed border-[#7C6BB3]"
            onClick={handleImageUploadClick}
          >
            {imageDataUrl ? (
              <div
                ref={canvasContainerRef}
                style={{
                  width: isDesktop ? "480px" : "320px",
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
                <ImageIcon height={40} width={40} color="#7C6BB3" />
                <p className="text-[#7C6BB3]  text-xs">
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
                className="w-[320px] md:w-[480px] p-4 bg-[#FFE585] rounded-lg font-bold"
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
