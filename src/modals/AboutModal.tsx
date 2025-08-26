import ListGroup from "react-bootstrap/ListGroup";
import { BaseModal } from "./BaseModal";

type AboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <BaseModal title="About Me!" isOpen={isOpen} onClose={onClose}>
      <ListGroup>
        <ListGroup.Item>
          <strong>The Grouping Game</strong> is my solution to help Cast Members
          practice real-world guest grouping scenarios in a fun and accessible
          way.
        </ListGroup.Item>

        <ListGroup.Item>
          This project is a personal learning tool and is
          <strong>
            {" "}
            not affiliated with or endorsed by the Walt Disney Company
          </strong>
          in any way.
        </ListGroup.Item>

        <ListGroup.Item>
          My name is <strong>Ryan Arnold</strong>. I’m currently a Cast Member
          at Guardians of the Galaxy: Cosmic Rewind, and I’m always looking for
          ways to make training and learning more accessible for fellow Cast
          Members.
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Contact me!</strong>
          <p>
            Feel free to reach out with feedback, ideas, or if you’d like to
            collaborate.
          </p>
          <ul>
            <li>
              <a
                href="https://github.com/ryannarnoldd"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:ryannarnoldd@gmail.com">Email</a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/ryan-s-arnold/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </ListGroup.Item>
      </ListGroup>
    </BaseModal>
  );
};
