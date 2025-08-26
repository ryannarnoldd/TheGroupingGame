import { BaseModal } from "./BaseModal";
import Form from "react-bootstrap/Form";
import { RideKey } from "../types/types";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ride: RideKey;
  setRide: (ride: RideKey) => void;
  endShift: (showSummary: boolean) => void;
  beginShift: () => void;
  setEasyMode?: (active: boolean) => void;
};

export const SettingsModal = ({
  isOpen,
  onClose,
  ride,
  setRide,
  endShift,
  beginShift,
  setEasyMode,
}: SettingsModalProps) => {
  return (
    <BaseModal title="Settings" isOpen={isOpen} onClose={onClose}>
      <Form>
        <Form.Group controlId="rideSelect" className="mb-3">
          <Form.Label>Ride:</Form.Label>
          <Form.Select
            value={ride}
            onChange={(e) => {
              setRide(e.target.value as RideKey);
              endShift(true); // End the current shift and show summary when changing rides
              beginShift();
            }}
          >
            <option value="GOTG">Guardians</option>
            <option value="SM">Space Mountain</option>
            <option value="TRON">Tron Lightcycle/Run</option>
            <option value="SPIDER">Spider-Man</option>
          </Form.Select>
        </Form.Group>

        {/* initaly start it as checked. when flipped, setEasyMode to that. */}
        <Form.Check
          type="switch"
          id="timer"
          label="Easy Mode (No Timer?)"
          onChange={(e) => {
            if (setEasyMode) {
              setEasyMode(!e.target.checked);
            }
          }}
        />
      </Form>
    </BaseModal>
  );
};
