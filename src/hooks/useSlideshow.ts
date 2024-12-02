import { useState, useCallback, useEffect, useRef } from "react";
import type { SlideImage } from "../types";

export const useSlideshow = (images: SlideImage[]) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const baseScale = 1.05;
  const maxScale = 2;

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

  const pauseSlideshow = useCallback(() => {
    setIsPaused(true);
    if (!isFullscreen) {
      setScale(baseScale);
    }
  }, [isFullscreen]);

  const resumeSlideshow = useCallback(() => {
    setIsPaused(false);
    setScale(1); // Reset scale when mouse leaves
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isPaused) {
        event.preventDefault();
        const delta = event.deltaY * -0.001; // More subtle scaling
        setScale((prevScale) => {
          const newScale = prevScale + delta;
          return Math.min(Math.max(newScale, 1.05), 1.5); // Limit between hover scale and max scale
        });
      }
    },
    [isPaused],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    setScale(1); // Reset scale when toggling fullscreen
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") changeSlide(-1);
      if (e.key === "ArrowRight") changeSlide(1);
    };

    document.addEventListener("keydown", handleKeyDown);

    if (!isPaused) {
      intervalRef.current = window.setInterval(() => {
        changeSlide(1);
      }, 3000);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [changeSlide, isPaused]);

  return {
    currentSlide,
    showSlide,
    changeSlide,
    pauseSlideshow,
    resumeSlideshow,
    scale,
    handleWheel,
    isFullscreen,
    toggleFullscreen,
  };
};
