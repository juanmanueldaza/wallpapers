import { useEffect, useRef, useState, useCallback } from "react";
import { preloadImages } from "@utils/imagePreloader";
import styles from "@styles/Slideshow.module.css";
import type { SlideImage } from "@types";
import { Controls } from "@components/slideshow/Controls";
import { NavBar } from "@components/common/NavBar";
import { Loading } from "@components/slideshow/Loading";

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
  const [selectedImage, setSelectedImage] = useState<SlideImage | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const getCurrentImageIndex = useCallback(() => {
    if (!selectedImage) return -1;
    return images.findIndex((img) => img.id === selectedImage.id);
  }, [selectedImage]);

  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      const currentIndex = getCurrentImageIndex();
      if (currentIndex === -1) return;

      let newIndex: number;
      if (direction === "next") {
        newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      }

      setSelectedImage(images[newIndex]);
    },
    [getCurrentImageIndex],
  );

  useEffect(() => {
    const allImageUrls = images.map((img) => img.urlthumbnail);
    preloadImages(allImageUrls)
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error preloading images:", error));
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setSelectedImage(null);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          navigateImage("next");
          break;
        case "ArrowLeft":
          e.preventDefault();
          navigateImage("prev");
          break;
        case "Escape":
          handleClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, navigateImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        navigateImage("prev");
      } else {
        navigateImage("next");
      }
    }

    touchStartX.current = null;
  };

  const handleImageError = (id: string) => {
    setImageLoadError(`Failed to load image ${id}`);
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    const link = document.createElement("a");
    link.href = selectedImage.urldownload;
    link.download = `uwJuamManuelDaza-${selectedImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = async (image: SlideImage) => {
    setSelectedImage(image);
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error entering fullscreen:", err);
      }
    }
  };

  const handleClose = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error exiting fullscreen:", err);
      }
    }
    setSelectedImage(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className={styles.mainContainer}>
      <NavBar />

      <div ref={containerRef} className={styles.container}>
        {isFullscreen && selectedImage ? (
          <div
            className={styles.fullscreenContainer}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Controls onClose={handleClose} onDownload={handleDownload} />
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className={styles.fullscreenImage}
              onError={() => handleImageError(selectedImage.id)}
            />
          </div>
        ) : (
          <div className={styles.gridContainer}>
            {images.map((image) => (
              <div
                key={image.id}
                className={styles.gridItem}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.urlthumbnail}
                  alt={image.alt}
                  className={styles.thumbnail}
                  onError={() => handleImageError(image.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {imageLoadError && <div className={styles.error}>{imageLoadError}</div>}
    </div>
  );
};

export default Slideshow;
