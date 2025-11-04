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
  easyMode: boolean;
  setEasyMode: (active: boolean) => void;
  rowRequests: boolean;
  setRowRequests: (active: boolean) => void;
  currentTrains: number;
};

export const SettingsModal = ({
  isOpen,
  onClose,
  ride,
  setRide,
  endShift,
  // beginShift,
  easyMode,
  setEasyMode,
  rowRequests,
  setRowRequests,
  currentTrains
}: SettingsModalProps) => {
  const toggleEasyMode = () => {
    setEasyMode(!easyMode);
  };

  const toggleRowRequests = () => {
    setRowRequests(!rowRequests);
  }

  return (
    <BaseModal title="Settings" isOpen={isOpen} onClose={onClose}>
      <Form>
        <Form.Group controlId="rideSelect" className="mb-3">
          <Form.Label>Ride:</Form.Label>
          <Form.Select
            value={ride}
            onChange={(e) => {
              setRide(e.target.value as RideKey);

              if (currentTrains > 0) endShift(true);
            }}
          >
            <option defaultChecked value="GOTG">Guardians</option>
            <option value="RNR">Rock 'n' Roller Coaster</option>
            <option value="SM">Space Mountain</option>
            <option value="TRON">Tron Lightcycle/Run</option>
            <option value="SPIDER">Spider-Man</option>
          </Form.Select>
        </Form.Group>

        <Form.Check
          defaultChecked={easyMode}
          type="switch"
          id="timer"
          label="Easy Mode (No Timer?)"
          // checked={easyMode}
          onChange={toggleEasyMode}
        />

        <Form.Check
          defaultChecked={rowRequests}
          type="switch"
          id="requests"
          label="No Row Requests?"
          // checked={easyMode}
          onChange={toggleRowRequests}
        />
      </Form>
    </BaseModal>
  );
};