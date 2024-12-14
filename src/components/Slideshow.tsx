import { useEffect, useRef, useState } from "react"; // Add useState to imports
import { preloadImages } from "../utils/imagePreloader";
import { useSlideshow } from "../hooks/useSlideshow";
import styles from "../styles/Slideshow.module.css";
import animations from "../styles/animations.module.css";
import type { SlideImage } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { getImagePath } from "../config/images";

const createImage = (id: string): SlideImage => ({
  id: id,
  url: getImagePath(`daza${id}-medium.webp`),
  urlthumbnail: getImagePath(`daza${id}-small.webp`),
  urldownload: getImagePath(`daza${id}.jpg`),
  alt: `Slide ${id}`,
});

const imageIds = ["051", "052", "054", "072", "088", "478"];
const images: SlideImage[] = imageIds.map(createImage);

const Slideshow: React.FC = () => {
  // Move all hooks to the top level of the component
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);
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

  const handleImageError = (id: string) => {
    setImageLoadError(`Failed to load image ${id}`);
  };

  useEffect(() => {
    const allImageUrls = images.flatMap((img) => [img.url, img.urlthumbnail]);

    preloadImages(allImageUrls)
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error preloading images:", error));
  }, []);

  useEffect(() => {
    const elem = document.documentElement;
    if (
      !elem.requestFullscreen &&
      !elem.mozRequestFullScreen &&
      !elem.webkitRequestFullscreen &&
      !elem.msRequestFullscreen
    ) {
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

  if (isLoading) {
    return <div className={styles.loading}>Loading images...</div>;
  }

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
                cursor: isFullscreen ? "zoom-in" : "pointer", // Modify cursor based on fullscreen state
              }}
              onClick={toggleFullscreen}
            >
              <img
                src={img.url}
                alt={img.alt}
                className={styles.mainImage}
                onError={() => handleImageError(img.id)}
                onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
              />

              {imageLoadError && (
                <div className={styles.error}>{imageLoadError}</div>
              )}
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
