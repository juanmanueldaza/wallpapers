import { useEffect, useRef } from "react";
import { useSlideshow } from "../hooks/useSlideshow";
import styles from "../styles/Slideshow.module.css";
import animations from "../styles/animations.module.css";
import type { SlideImage } from "../types";

const images: SlideImage[] = [
  { id: "1", url: "/pictures/daza051.jpg", alt: "Slide 1" },
  { id: "2", url: "/pictures/daza052.jpg", alt: "Slide 2" },
  { id: "3", url: "/pictures/daza054.jpg", alt: "Slide 3" },
  { id: "4", url: "/pictures/daza072.jpg", alt: "Slide 4" },
  { id: "5", url: "/pictures/daza088.jpg", alt: "Slide 5" },
  { id: "6", url: "/pictures/daza478.jpg", alt: "Slide 6" },
];

const Slideshow: React.FC = () => {
  const {
    currentSlide,
    showSlide,
    pauseSlideshow,
    resumeSlideshow,
    scale,
    handleWheel,
    isFullscreen,
    toggleFullscreen,
  } = useSlideshow(images);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  return (
    <div className={styles.mainContainer}>
      <div
        ref={containerRef}
        className={`${styles.slideshowContainer} ${
          isFullscreen ? styles.fullscreen : ""
        }`}
        onMouseEnter={pauseSlideshow}
        onMouseLeave={resumeSlideshow}
      >
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`${styles.slide} ${animations.fadeIn}`}
            style={{
              display: index === currentSlide ? "block" : "none",
            }}
          >
            <div
              className={styles.imageWrapper}
              style={{
                transform: `scale(${scale})`,
              }}
              onClick={toggleFullscreen}
            >
              <img src={img.url} alt={img.alt} className={styles.mainImage} />
            </div>
          </div>
        ))}
      </div>

      {!isFullscreen && (
        <div className={styles.thumbnailContainer}>
          {images.map((img, index) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Thumbnail ${index + 1}`}
              className={`${styles.thumbnail} ${
                index === currentSlide ? styles.activeThumbnail : ""
              }`}
              onClick={() => showSlide(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  showSlide(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slideshow;
