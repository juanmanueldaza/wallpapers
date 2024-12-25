import { faXmark, faDownload } from "@fortawesome/free-solid-svg-icons";
import styles from "@styles/Slideshow.module.css";
import { Button } from "../common/Button";

interface ControlsProps {
  onClose: () => void;
  onDownload: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onClose, onDownload }) => (
  <div className={styles.controls}>
    <Button
      icon={faXmark}
      onClick={onClose}
      ariaLabel="Exit fullscreen"
      variant="close"
    />
    <Button
      icon={faDownload}
      onClick={onDownload}
      ariaLabel="Download current image"
      variant="download"
    />
  </div>
);
