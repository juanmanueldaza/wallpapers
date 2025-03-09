import { faXmark, faDownload } from "@fortawesome/free-solid-svg-icons";
import styles from "@styles/NavBar.module.css";
import { Button } from "@components/common/Button";

interface ControlsProps {
  onClose: () => void;
  onDownload: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onClose, onDownload }) => (
  <nav className={styles.navbar}>
    <div className={styles.brand}>
      <h1>Photo Gallery</h1>
    </div>
    <div className={styles.social}>
      <Button
        icon={faDownload}
        onClick={onDownload}
        ariaLabel="Download current image"
        variant="download"
      />
      <Button
        icon={faXmark}
        onClick={onClose}
        ariaLabel="Exit fullscreen"
        variant="close"
      />
    </div>
  </nav>
);
