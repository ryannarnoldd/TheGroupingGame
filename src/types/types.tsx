import { RIDES } from "../context/settings";

export type Group = {
  id: number;
  size: number;
  color: string;
  request?: "Front" | "Back" | "Row 1" | "Row 9" | "Odd" | "Even" | "Alone" | "Together";
}

export type Seat = {
  id: number;
  row: number;
  takenBy?: number;
  isSelected?: boolean;
};

export type Queues = {
  [key: string]: Group[];
};

export type StoredShiftState = {
  emptySeats: number
  seatsPerTrain: number
  totalTrains: number
}

export type ShiftStats = {
  totalShifts: number
  highestShift: StoredShiftState
  mostAccurateShift: StoredShiftState
}

export type RideKey = keyof typeof RIDES;