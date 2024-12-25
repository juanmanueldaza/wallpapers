import styles from "@styles/Slideshow.module.css";
import animations from "@styles/animations.module.css";
import type { SlideImage } from "../../types";

interface FullscreenImageProps {
  image: SlideImage;
  isVisible: boolean;
  scale: number;
  isFullscreen: boolean;
  onImageError: (id: string) => void;
  onClick: () => void;
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({
  image,
  isVisible,
  scale,
  isFullscreen,
  onImageError,
  onClick,
}) => (
  <div
    className={`${styles.slide} ${animations.fadeIn}`}
    style={{ display: isVisible ? "block" : "none" }}
  >
    <div
      className={styles.imageWrapper}
      style={{
        transform: `scale(${scale})`,
        cursor: isFullscreen ? "zoom-in" : "pointer",
      }}
      onClick={onClick}
    >
      <img
        src={image.url}
        alt={image.alt}
        className={styles.mainImage}
        onError={() => onImageError(image.id)}
        onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
      />
    </div>
  </div>
);
