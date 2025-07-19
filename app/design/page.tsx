"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { SUPPORTED_MIME_TYPES } from "../_constants/file";
import { ImageAdjustment } from "../_components/ImageAdjustment";
import { useCanvasRendererContext } from "../_contexts/CanvasRendererContext";
import { usePreviewImg } from "../_hooks/usePreviewImage";
import { useViewSize } from "../_hooks/useViewSize";
import { useDragAndDropFile } from "../_hooks/useDragAndDropFile";

export default function DesignPage() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const imageUploadButtonRef = useRef<HTMLButtonElement | null>(null);

  const { render, createCanvasRenderer, setImage } = useCanvasRendererContext();

  const { isDesktop } = useViewSize();

  const [openedImageAdjustment, setOpenedImageAdjustment] = useState(false);

  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const imageDataUrl = usePreviewImg(uploadedImageFile);

  const { isDragging } = useDragAndDropFile(
    imageUploadButtonRef,
    (file) => {
      setOpenedImageAdjustment(true);
      setUploadedImageFile(file);
    },
    SUPPORTED_MIME_TYPES
  );

  const handleImageUploadClick = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const handleUploadImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = evt.target.files?.[0];
    if (!imgFile) return;
    if (!SUPPORTED_MIME_TYPES.includes(imgFile?.type || "")) return;

    setOpenedImageAdjustment(true);
    setUploadedImageFile(imgFile);
  };

  const handleDownloadImage = () => {
    render();
    const dataUrl = canvasRef.current?.toDataURL(uploadedImageFile?.type);
    if (!dataUrl) return;

    const aElement = document.createElement("a");
    aElement.download = `${uuidv4()}.${uploadedImageFile?.type.split("/")[1]}`;
    aElement.href = dataUrl;

    aElement.click();
  };

  const onLoadImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    setImage(imageRef.current);
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
      <ImageAdjustment
        open={openedImageAdjustment}
        onOpenChange={setOpenedImageAdjustment}
      />

      <main
        className={clsx(
          "mt-8 flex flex-col items-center",
          isDesktop && openedImageAdjustment && "w-[100%-360px]"
        )}
      >
        <section className="my-8 flex gap-4 relative">
          {imageDataUrl && !openedImageAdjustment && (
            <div
              className={clsx(
                "absolute top-[-48px] py-2 px-2.5 rounded-xl bg-white shadow-md"
              )}
            >
              <button
                className="flex items-center cursor-pointer"
                onClick={() => setOpenedImageAdjustment(true)}
              >
                <ImageIcon size={14} />
                <span className="ml-1 text-xs font-bold">편집</span>
              </button>
            </div>
          )}

          <button
            ref={imageUploadButtonRef}
            className={clsx(
              "w-[320px] md:w-[480px] min-h-[360px]",
              "flex justify-center items-center",
              "p-8 border-[2.5px] border-dashed border-[#7C6BB3] rounded-xl",
              isDragging && "shadow-2xl"
            )}
            onClick={handleImageUploadClick}
          >
            {imageDataUrl ? (
              <div ref={canvasContainerRef} className="flex-auto">
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
            accept={SUPPORTED_MIME_TYPES.join(",")}
          />
        </section>
        {imageDataUrl &&
          SUPPORTED_MIME_TYPES.includes(uploadedImageFile?.type ?? "") && (
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
