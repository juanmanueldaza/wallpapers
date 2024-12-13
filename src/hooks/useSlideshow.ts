import { useState, useCallback, useEffect } from "react";
import type { SlideImage } from "../types";

export const useSlideshow = (
  images: SlideImage[],
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
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

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isPaused) return;
      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;

      // Store start coordinates
      containerRef.current!.dataset.touchStartX = startX.toString();
      containerRef.current!.dataset.touchStartY = startY.toString();
    },
    [isPaused, containerRef],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isPaused) return;
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;
      const startX = parseInt(
        containerRef.current!.dataset.touchStartX || "0",
        10,
      );
      const startY = parseInt(
        containerRef.current!.dataset.touchStartY || "0",
        10,
      );
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Check for horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        // 50 is a threshold for swipe sensitivity
        if (diffX > 0) {
          changeSlide(-1);
        } else {
          changeSlide(1);
        }
        containerRef.current!.dataset.touchStartX = "0"; // Reset for next swipe
        containerRef.current!.dataset.touchStartY = "0";
      }
    },
    [isPaused, changeSlide, containerRef],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, containerRef]);

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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
