import styles from "@styles/Slideshow.module.css";
import type { SlideImage } from "@types";

interface ThumbnailsProps {
  images: SlideImage[];
  currentSlide: number;
  onThumbnailClick: (index: number) => void;
}

export const Thumbnails: React.FC<ThumbnailsProps> = ({
  images,
  currentSlide,
  onThumbnailClick,
}) => (
  <div className={styles.thumbnailContainer}>
    {images.map((img, index) => (
      <img
        key={img.id}
        src={img.urlthumbnail}
        alt={`Thumbnail ${index + 1}`}
        className={`${styles.thumbnail} ${
          index === currentSlide ? styles.activeThumbnail : ""
        }`}
        onClick={() => onThumbnailClick(index)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onThumbnailClick(index);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Show slide ${index + 1}`}
      />
    ))}
  </div>
);

export default Thumbnails;
