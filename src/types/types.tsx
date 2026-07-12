import { RIDES } from "../lib/rides";

export type Group = {
  id: number;
  size: number;
  color: string;
  request?: number;
};

export type Seat = {
  id: number;
  row: number;
  takenBy?: number;
  isSelected: boolean;
};

export type Queues = {
  [key: string]: Group[];
};

export type StoredShiftState = {
  emptySeats: number;
  seatsPerTrain: number;
  totalTrains: number;
};

export type ShiftStats = {
  totalShifts: number;
  highestShift: StoredShiftState;
  mostAccurateShift: StoredShiftState;
};

export type RideKey = keyof typeof RIDES;

export type Ride = {
  NAME: string;
  ALTERNATING_QUEUE: boolean;
  CARS: number;
  ROWS_PER_CAR: number;
  SEATS_PER_ROW: number;
  QUEUE_SIZE: number;
  GROUP_SIZES: { [key: number]: number[] };
  NUMBER_OF_HOLDINGQUEUES: number;
  DISPATCH_INTERVAL: number;
};