import { useEffect, useState } from "react";

export const usePreviewImg = (imgFile: File | null) => {
  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    if (!imgFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result as string);
    };
    reader.readAsDataURL(imgFile);
    return () => {
      reader.abort();
    };
  }, [imgFile]);

  return previewSrc;
};
