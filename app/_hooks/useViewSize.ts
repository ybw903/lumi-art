import { useMediaQuery } from "./useMediaQuery";

export const useViewSize = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return {
    isDesktop,
    // [TODO] 사이즈별 처리
    isMobile: !isDesktop,
  };
};
