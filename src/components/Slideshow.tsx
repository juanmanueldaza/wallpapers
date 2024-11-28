import { useSlideshow } from "../hooks/useSlideshow";
import styles from "../styles/Slideshow.module.css";
import animations from "../styles/animations.module.css";
import type { SlideImage } from "../types";

const images: SlideImage[] = [
  { id: "1", url: "/src/assets/pictures/daza051.jpg", alt: "Slide 1" },
  { id: "2", url: "/src/assets/pictures/daza052.jpg", alt: "Slide 2" },
  { id: "3", url: "/src/assets/pictures/daza054.jpg", alt: "Slide 3" },
  { id: "4", url: "/src/pictures/daza072.jpg", alt: "Slide 4" },
  { id: "5", url: "/src/pictures/daza088.jpg", alt: "Slide 5" },
];

const Slideshow: React.FC = () => {
  const { currentSlide, showSlide } = useSlideshow(images);

  return (
    <>
      <div className={styles.slideshowContainer}>
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`${styles.slide} ${animations.fadeIn}`}
            style={{ display: index === currentSlide ? "block" : "none" }}
          >
            <img src={img.url} alt={img.alt} />
          </div>
        ))}
      </div>

      <div className={styles.dotsContainer}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ""}`}
            onClick={() => showSlide(index)}
            role="button"
            tabIndex={0}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default Slideshow;
