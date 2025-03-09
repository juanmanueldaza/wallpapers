import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Button } from "./Button";
import styles from "@styles/NavBar.module.css";

export const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.social}>
        <Button
          icon={faInstagram}
          onClick={() => {}}
          ariaLabel="View on Instagram"
          variant="github"
          href="https://instagram.com/ultravietnamita"
          target="_blank"
          rel="noopener noreferrer"
        />
        <Button
          icon={faGithub}
          onClick={() => {}}
          ariaLabel="View source on GitHub"
          variant="github"
          href="https://github.com/juanmanueldaza/wallpapers"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </nav>
  );
};
