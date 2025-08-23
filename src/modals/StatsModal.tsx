import ListGroup from "react-bootstrap/ListGroup";
import { BaseModal } from "./BaseModal";
import { loadStatsFromLocalStorage } from "../lib/localStorage";
import { ShiftStats, StoredShiftState } from "../types/types";
import { formatShift } from "../lib/stats";
import { Button } from "react-bootstrap";
import { deleteStatsFromLocalStorage } from "../lib/localStorage";

type StatsModalProps = {
  currentShift: StoredShiftState;
  isOpen: boolean;
  onClose: () => void;
};

const handleDelete = () => {
  deleteStatsFromLocalStorage();
  window.location.reload();

}

export const StatsModal = ({ isOpen, onClose, currentShift }: StatsModalProps) => {
  const stats = loadStatsFromLocalStorage() as ShiftStats;

  // const highestShift = getHighScore(stats);
  // const mostAccurateShift = getHighestAccuracy(stats);

  if (!stats) {
    return null; // or handle the case where stats are not available
  }

  return (
    <BaseModal title="Shift Summary(s)" isOpen={isOpen} onClose={onClose}>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Current Shift:</strong>
          <div style={{ marginLeft: "1rem" }}>{formatShift(currentShift)}</div>
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Highest Shift:</strong>
          <div style={{ marginLeft: "1rem" }}>{formatShift(stats.highestShift)}</div>
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Most Accurate Shift:</strong>
          <div style={{ marginLeft: "1rem" }}>{formatShift(stats.mostAccurateShift)}</div>
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Total Shifts Worked:</strong> {stats.totalShifts}
        </ListGroup.Item>
      </ListGroup>

      {/* Button to "reset stats" */}
      <Button variant="danger" onClick={() => handleDelete()}>
        Reset Stats
      </Button>
    </BaseModal>
  );
};
