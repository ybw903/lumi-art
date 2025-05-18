import clsx from "clsx";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./Sheet";
import { Slider } from "./Slider";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./Drawer";
import { useViewSize } from "../_hooks/useViewSize";
import { useCanvasRendererContext } from "../_contexts/CanvasRendererContext";

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

interface ImageAdjustmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageAdjustment = ({
  open,
  onOpenChange,
}: ImageAdjustmentProps) => {
  const { isDesktop, isMobile } = useViewSize();
  const [adjustmentType, setAdjustmentType] = useState(
    AdjustmentType.BRIGHTNESS
  );

  const { adjustments, setAdjustments } = useCanvasRendererContext();

  const handleAdjustmentType = (tab: AdjustmentType) => () => {
    setAdjustmentType(tab);
  };

  const handleAdjustment = (value: number, type: AdjustmentType) => {
    setAdjustments({ ...adjustments, [type]: value });
  };

  if (!open) return;

  return (
    <>
      {isDesktop && (
        <aside className="w-[360px]">
          <Sheet
            defaultOpen={true}
            open={open}
            onOpenChange={onOpenChange}
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

              <section className="flex flex-col">
                <div className="w-full flex flex-col py-4">
                  {adjustmentType === AdjustmentType.BRIGHTNESS && (
                    <Slider
                      value={[adjustments.brightness]}
                      max={1}
                      min={-1}
                      step={0.01}
                      onValueChange={([value]) =>
                        handleAdjustment(value, AdjustmentType.BRIGHTNESS)
                      }
                    />
                  )}
                  {adjustmentType === AdjustmentType.EXPOSURE && (
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
                  {adjustmentType === AdjustmentType.CONTRAST && (
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
                  {adjustmentType === AdjustmentType.HIGHLIGHTS && (
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
                  {adjustmentType === AdjustmentType.SHADOWS && (
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
                  {adjustmentType === AdjustmentType.SATURATION && (
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
                <div className="w-full py-2 flex gap-2  overflow-auto">
                  {Object.values(AdjustmentType).map((AdjustmentType) => (
                    <button
                      key={`adjustment-tab-${AdjustmentType}`}
                      className={clsx(
                        "w-24 flex-shrink-0 text-center p-2 rounded  font-bold text-white bg-violet-400",
                        adjustmentType === AdjustmentType && "bg-violet-700",
                        adjustmentType !== AdjustmentType &&
                          "hover:bg-violet-500"
                      )}
                      onClick={handleAdjustmentType(AdjustmentType)}
                    >
                      {ADJUSTMENT_TYPE_RESOURCES[AdjustmentType]}
                    </button>
                  ))}
                </div>
              </section>
            </SheetContent>
          </Sheet>
        </aside>
      )}
      {isMobile && (
        <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>조정</DrawerTitle>
                <DrawerDescription className="hidden">
                  이미지 필터를 적용합니다.
                </DrawerDescription>
              </DrawerHeader>
              <section className="flex flex-col px-4">
                <div className="w-full flex flex-col py-4">
                  {adjustmentType === AdjustmentType.BRIGHTNESS && (
                    <Slider
                      value={[adjustments.brightness]}
                      max={1}
                      min={-1}
                      step={0.01}
                      onValueChange={([value]) =>
                        handleAdjustment(value, AdjustmentType.BRIGHTNESS)
                      }
                    />
                  )}
                  {adjustmentType === AdjustmentType.EXPOSURE && (
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
                  {adjustmentType === AdjustmentType.CONTRAST && (
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
                  {adjustmentType === AdjustmentType.HIGHLIGHTS && (
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
                  {adjustmentType === AdjustmentType.SHADOWS && (
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
                  {adjustmentType === AdjustmentType.SATURATION && (
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
                <div className="w-full py-3 flex gap-2 overflow-auto">
                  {Object.values(AdjustmentType).map((AdjustmentType) => (
                    <button
                      key={`adjustment-tab-${AdjustmentType}`}
                      className={clsx(
                        "w-24 flex-shrink-0 text-center p-2 rounded  font-bold text-white bg-violet-400",
                        adjustmentType === AdjustmentType && "bg-violet-700",
                        adjustmentType !== AdjustmentType &&
                          "hover:bg-violet-500"
                      )}
                      onClick={handleAdjustmentType(AdjustmentType)}
                    >
                      {ADJUSTMENT_TYPE_RESOURCES[AdjustmentType]}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
