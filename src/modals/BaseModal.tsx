import { Modal } from "react-bootstrap";

type BaseModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const BaseModal = ({
  title,
  children,
  isOpen,
  onClose,
}: BaseModalProps) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
