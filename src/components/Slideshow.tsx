import { useEffect, useRef } from "react";
import { useSlideshow } from "../hooks/useSlideshow";
import styles from "../styles/Slideshow.module.css";
import animations from "../styles/animations.module.css";
import type { SlideImage } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const createImage = (id: string): SlideImage => ({
  id: id,
  url: `/pictures/daza${id}-medium.webp`,
  urlthumbnail: `/pictures/daza${id}-small.webp`,
  urldownload: `/pictures/daza${id}.jpg`,
  alt: `Slide ${id}`,
});

const imageIds = ["051", "052", "054", "072", "088", "478"];

const images: SlideImage[] = imageIds.map(createImage);

const Slideshow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentSlide,
    showSlide,
    pauseSlideshow,
    resumeSlideshow,
    scale,
    handleWheel,
    isFullscreen,
    toggleFullscreen,
  } = useSlideshow(images, containerRef);

  useEffect(() => {
    const elem = document.documentElement;
    if (
      !elem.requestFullscreen &&
      !elem.mozRequestFullScreen && // Firefox
      !elem.webkitRequestFullscreen && // Chrome, Safari & Opera
      !elem.msRequestFullscreen
    ) {
      // IE/Edge
      console.warn("Fullscreen API is not supported in this browser");
    }
  }, []);

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

  const handleDownload = () => {
    const currentImage = images[currentSlide];
    const link = document.createElement("a");
    link.href = currentImage.urldownload;
    link.download = `uwJuamManuelDaza-${currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.mainContainer}>
      {!isFullscreen && (
        <a
          href="https://github.com/juanmanueldaza/wallpapers"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={styles.githubButton}>
            <FontAwesomeIcon icon={faGithub} />
          </button>
        </a>
      )}
      <div
        ref={containerRef}
        className={`${styles.slideshowContainer} ${
          isFullscreen ? styles.fullscreen : ""
        }`}
        onMouseEnter={pauseSlideshow}
        onMouseLeave={resumeSlideshow}
      >
        {isFullscreen && (
          <div className={styles.controls}>
            <button
              className={styles.closeButton}
              onClick={toggleFullscreen}
              aria-label="Exit fullscreen"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <button
              className={styles.downloadButton}
              onClick={handleDownload}
              aria-label="Download current image"
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        )}

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
              src={img.urlthumbnail}
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
