import { useEffect, useRef, useState, useCallback } from "react";
import { preloadImages } from "@utils/imagePreloader";
import styles from "@styles/Slideshow.module.css";
import type { SlideImage } from "@types";
import { Controls } from "@components/slideshow/Controls";
import { NavBar } from "@components/common/NavBar";
import { Loading } from "@components/slideshow/Loading";

// Use Vite's import.meta.env to handle environment-specific paths
const BASE_URL = import.meta.env.BASE_URL || "/";

// Modify the image path construction
const imageFiles = Object.values(
  import.meta.glob("/public/pictures/*.{jpg,webp}", {
    eager: true,
    as: "url",
  }),
).map((path) => (path.startsWith("/") ? path : `${BASE_URL}${path}`));

// Helper function to construct correct image URLs
const getImageUrl = (filename: string): string => {
  return `${BASE_URL}pictures/${filename}`;
};

// Function to extract ID from filename
const getImageId = (filename: string) => {
  const match = filename.match(/daza(\d+)/);
  return match ? match[1] : null;
};

// Create images array from glob results
const images: SlideImage[] = Array.from(
  new Set(
    imageFiles
      .map((path) => getImageId(path))
      .filter((id): id is string => id !== null),
  ),
)
  .map((id) => ({
    id,
    url: getImageUrl(`daza${id}-medium.webp`),
    urlthumbnail: getImageUrl(`daza${id}-small.webp`),
    urldownload: getImageUrl(`daza${id}.jpg`),
    alt: `Slide ${id}`,
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

const Slideshow: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingErrors, setLoadingErrors] = useState<Record<string, string>>(
    {},
  );
  const [selectedImage, setSelectedImage] = useState<SlideImage | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleImageError = (
    id: string,
    imageType: "thumbnail" | "full" | "download",
  ) => {
    console.error(`Failed to load ${imageType} image:`, {
      id,
      url: images.find((img) => img.id === id)?.[
        imageType === "thumbnail"
          ? "urlthumbnail"
          : imageType === "full"
            ? "url"
            : "urldownload"
      ],
      baseUrl: BASE_URL,
      env: import.meta.env.MODE,
    });

    setLoadingErrors((prev) => ({
      ...prev,
      [`${id}-${imageType}`]: `Failed to load ${imageType} image ${id}`,
    }));
  };

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

  // Debug logging during initialization
  useEffect(() => {
    console.log("Environment:", import.meta.env.MODE);
    console.log("Base URL:", BASE_URL);
    console.log("Image files found:", imageFiles);
  }, []);

  // Preload images
  useEffect(() => {
    const preloadImageWithRetry = async (
      url: string,
      retries = 3,
    ): Promise<void> => {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return preloadImageWithRetry(url, retries - 1);
        }
        throw error;
      }
    };

    const loadImages = async () => {
      setIsLoading(true);
      try {
        await Promise.all(
          images.map((img) => preloadImageWithRetry(img.urlthumbnail)),
        );
      } catch (error) {
        console.error("Image preloading failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // Handle fullscreen changes
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

  // Handle keyboard navigation
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
              onError={() => handleImageError(selectedImage.id, "full")}
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
                  onError={() => handleImageError(image.id, "thumbnail")}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {Object.keys(loadingErrors).length > 0 && (
        <div className={styles.error}>
          {Object.values(loadingErrors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slideshow;
