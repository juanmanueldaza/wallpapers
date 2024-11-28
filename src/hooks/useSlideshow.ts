import { useState, useCallback, useEffect } from "react";
import type { SlideImage } from "../types";

export const useSlideshow = (images: SlideImage[]) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const showSlide = useCallback(
    (n: number): void => {
      let slideNumber: number;
      if (n >= images.length) {
        slideNumber = 0;
      } else if (n < 0) {
        slideNumber = images.length - 1;
      } else {
        slideNumber = n;
      }
      setCurrentSlide(slideNumber);
    },
    [images.length],
  );

  const changeSlide = useCallback(
    (n: number): void => {
      showSlide(currentSlide + n);
    },
    [currentSlide, showSlide],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") changeSlide(-1);
      if (e.key === "ArrowRight") changeSlide(1);
    };

    document.addEventListener("keydown", handleKeyDown);

    const interval = setInterval(() => {
      changeSlide(1);
    }, 3000);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [changeSlide]);

  return {
    currentSlide,
    showSlide,
    changeSlide,
  };
};
