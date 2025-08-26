import { BaseModal } from "./BaseModal";

type AlertProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export const Alert = ({ isOpen, message, onClose }: AlertProps) => {
  return (
    <BaseModal title="Alert!" isOpen={isOpen} onClose={onClose}>
      <h1>{message}</h1>
    </BaseModal>
  );
};
