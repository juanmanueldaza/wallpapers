import { useState, useCallback, useEffect, useRef } from "react";
import type { SlideImage } from "../types";

export const useSlideshow = (
  images: SlideImage[],
  containerRef: React.RefObject<HTMLDivElement>,
) => {
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
        const delta = event.deltaY * -0.002;
        setScale((prevScale) => {
          const newScale = prevScale + delta;
          return Math.min(Math.max(newScale, baseScale), maxScale); // Using maxScale here
        });
      }
    },
    [isPaused],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`,
          );
        });
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
    setScale(1);
  }, [containerRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
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
