import { useEffect, useRef, useState } from "react";
import { preloadImages } from "@utils/imagePreloader";
import { useSlideshow } from "@hooks/useSlideshow";
import styles from "@styles/Slideshow.module.css";
import type { SlideImage } from "@types";
import { getImagePath } from "@config/images";
import { Controls } from "@components/slideshow/Controls";
import { FullscreenImage } from "@components/slideshow/FullscreenImage";
import { GithubButton } from "@components/slideshow/GithubButton";
import { Loading } from "@components/slideshow/Loading";
import { Thumbnails } from "@components/slideshow/Thumbnails";

const createImage = (id: string): SlideImage => ({
  id: id,
  url: getImagePath(`daza${id}-medium.webp`),
  urlthumbnail: getImagePath(`daza${id}-small.webp`),
  urldownload: getImagePath(`daza${id}.jpg`),
  alt: `Slide ${id}`,
});

const imageIds = [
  "007",
  "009",
  "024",
  "036",
  "047",
  "051",
  "052",
  "054",
  "060",
  "061",
  "063",
  "063",
  "067",
  "072",
  "088",
  "128",
  "131",
  "136",
  "140",
  "143",
  "474",
  "478",
];
const images: SlideImage[] = imageIds.map(createImage);

const Slideshow: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    currentSlide,
    showSlide,
    pauseSlideshow,
    resumeSlideshow,
    scale,
    isFullscreen,
    toggleFullscreen,
  } = useSlideshow(images, containerRef);

  useEffect(() => {
    const allImageUrls = images.flatMap((img) => [img.url, img.urlthumbnail]);
    preloadImages(allImageUrls)
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error preloading images:", error));
  }, []);

  const handleImageError = (id: string) => {
    setImageLoadError(`Failed to load image ${id}`);
  };

  const handleDownload = () => {
    const currentImage = images[currentSlide];
    const link = document.createElement("a");
    link.href = currentImage.urldownload;
    link.download = `uwJuamManuelDaza-${currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <Loading />;

  return (
    <div
      className={styles.mainContainer}
      onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
    >
      {!isFullscreen && <GithubButton />}
      <div
        ref={containerRef}
        className={`${styles.slideshowContainer} ${
          isFullscreen ? styles.fullscreen : ""
        }`}
        onMouseEnter={pauseSlideshow}
        onMouseLeave={resumeSlideshow}
        onTouchStart={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      >
        {isFullscreen && (
          <Controls onClose={toggleFullscreen} onDownload={handleDownload} />
        )}

        {images.map((img, index) => (
          <FullscreenImage
            key={img.id}
            image={img}
            isVisible={index === currentSlide}
            scale={scale}
            isFullscreen={isFullscreen}
            onImageError={handleImageError}
            onClick={toggleFullscreen}
          />
        ))}

        {imageLoadError && <div className={styles.error}>{imageLoadError}</div>}
      </div>

      {!isFullscreen && (
        <Thumbnails
          images={images}
          currentSlide={currentSlide}
          onThumbnailClick={showSlide}
        />
      )}
    </div>
  );
};

export default Slideshow;
