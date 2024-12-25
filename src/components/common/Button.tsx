import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import styles from "@styles/Button.module.css";

interface ButtonProps {
  icon?: IconDefinition;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "close" | "download" | "github" | "default";
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  className,
  children,
  variant = "default",
  href,
  target,
  rel,
}) => {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className || ""}`;

  const buttonContent = (
    <>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={styles.link}>
        <button
          className={buttonClassName}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {buttonContent}
        </button>
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {buttonContent}
    </button>
  );
};
