import { useEffect, useRef, useState } from "react";
import { preloadImages } from "@utils/imagePreloader";
import { useSlideshow } from "@hooks/useSlideshow";
import styles from "@styles/Slideshow.module.css";
import type { SlideImage } from "@types";
import { Controls } from "@components/slideshow/Controls";
import { FullscreenImage } from "@components/slideshow/FullscreenImage";
import { GithubButton } from "@components/slideshow/GithubButton";
import { Loading } from "@components/slideshow/Loading";
import { Thumbnails } from "@components/slideshow/Thumbnails";

// Use Vite's glob import to get all images
const imageFiles = import.meta.glob("/public/pictures/*.{jpg,webp}", {
  eager: true,
  as: "url",
});

// Function to extract ID from filename
const getImageId = (filename: string) => {
  const match = filename.match(/daza(\d+)/);
  return match ? match[1] : null;
};

// Create images array from glob results
const images: SlideImage[] = Object.entries(imageFiles)
  .reduce((acc: SlideImage[], [path, url]) => {
    const id = getImageId(path);
    if (id && path.includes("-medium.webp")) {
      acc.push({
        id,
        url: url as string,
        urlthumbnail: imageFiles[
          `/public/pictures/daza${id}-small.webp`
        ] as string,
        urldownload: imageFiles[`/public/pictures/daza${id}.jpg`] as string,
        alt: `Slide ${id}`,
      });
    }
    return acc;
  }, [])
  .sort((a, b) => a.id.localeCompare(b.id));

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
