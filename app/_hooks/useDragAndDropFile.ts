import { MutableRefObject, useEffect, useState } from "react";

export const useDragAndDropFile = (
  targetRef: MutableRefObject<HTMLElement | null>,
  onDropFile: (file: File) => void,
  extensions: string[] = []
) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const handleDragLeave = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    setIsDragging(false);
  };

  const handleDragOver = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer!.files) {
      setIsDragging(true);
    }
  };

  const handleDrop = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer?.files && evt.dataTransfer.files.length > 0) {
      if (!extensions.includes(evt.dataTransfer.files[0].type)) return;

      onDropFile(evt.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.addEventListener("dragenter", handleDragEnter);
      targetRef.current.addEventListener("dragleave", handleDragLeave);
      targetRef.current.addEventListener("dragover", handleDragOver);
      targetRef.current.addEventListener("drop", handleDrop);
    }

    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener("dragenter", handleDragEnter);
        targetRef.current.removeEventListener("dragleave", handleDragLeave);
        targetRef.current.removeEventListener("dragover", handleDragOver);
        targetRef.current.removeEventListener("drop", handleDrop);
      }
    };
  }, []);

  return {
    isDragging,
  };
};
