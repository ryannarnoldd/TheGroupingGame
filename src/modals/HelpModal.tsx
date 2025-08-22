import ListGroup from "react-bootstrap/ListGroup";
import { BaseModal } from "./BaseModal";

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  return (
    <BaseModal title="How to Play!" isOpen={isOpen} onClose={onClose}>
        <ListGroup>
            <ListGroup.Item>
            <strong>Objective:</strong> Group guests into trains with the least empty seats.
            </ListGroup.Item>
            <ListGroup.Item>
            <strong>Controls:</strong> Use the buttons to send trains, manage queues, and view stats.
            </ListGroup.Item>
            <ListGroup.Item>
            <strong>Tips:</strong> 
            <ul>
                <li>Pay attention to the ride type and guest preferences.</li>
                <li>Try to minimize empty seats for higher scores.</li>
                <li>Use the stats modal to track your performance.</li>
            </ul>
            </ListGroup.Item>
        </ListGroup>
    </BaseModal>
  );
};
