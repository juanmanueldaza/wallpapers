import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Button } from "../common/Button";

export const GithubButton: React.FC = () => (
  <Button
    icon={faGithub}
    onClick={() => {}}
    ariaLabel="View source on GitHub"
    variant="github"
    href="https://github.com/juanmanueldaza/wallpapers"
    target="_blank"
    rel="noopener noreferrer"
  />
);
