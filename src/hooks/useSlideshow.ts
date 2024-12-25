import { useState, useCallback, useEffect, useRef } from "react";
import type { SlideImage } from "@types";

export const useSlideshow = (
  images: SlideImage[],
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const touchStartRef = useRef<number | null>(null);

  const showSlide = useCallback(
    (n: number) => {
      let newIndex = n;
      if (newIndex >= images.length) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = images.length - 1;
      }
      setCurrentSlide(newIndex);
    },
    [images.length],
  );

  const changeSlide = useCallback(
    (direction: number) => {
      showSlide(currentSlide + direction);
    },
    [currentSlide, showSlide],
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartRef.current === null) return;

      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStartRef.current - touchEnd;
      const SWIPE_THRESHOLD = 50;

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        changeSlide(diff > 0 ? 1 : -1);
      }

      touchStartRef.current = null;
    },
    [changeSlide],
  );

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
  }, []);

  const pauseSlideshow = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeSlideshow = useCallback(() => {
    setIsPaused(false);
    setScale(1);
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isPaused && isFullscreen) {
        event.preventDefault();
        const delta = event.deltaY * -0.002;
        setScale((prevScale) => {
          const newScale = prevScale + delta;
          return Math.min(Math.max(newScale, 1.05), 2);
        });
      }
    },
    [isPaused, isFullscreen],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) =>
          console.error(`Error enabling fullscreen: ${err.message}`),
        );
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) =>
          console.error(`Error exiting fullscreen: ${err.message}`),
        );
    }
    setScale(1);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove, handleWheel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") changeSlide(-1);
      if (e.key === "ArrowRight") changeSlide(1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [changeSlide]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
