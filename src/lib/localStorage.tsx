import { StoredShiftState, ShiftStats } from "../types/types";
import { getStatsForCompletedGame } from "./stats";

export const saveStatsToLocalStorage = (currentShift: StoredShiftState) => {
  const getStats = getStatsForCompletedGame(currentShift);
  localStorage.setItem("shiftStats", JSON.stringify(getStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem("shiftStats");
  return stats ? (JSON.parse(stats) as ShiftStats) : null;
};

export const deleteStatsFromLocalStorage = () => {
  localStorage.removeItem("shiftStats");
};

export const initializeStats = () => {
  const defaultStats: ShiftStats = {
    totalShifts: 0,
    highestShift: { emptySeats: 0, totalTrains: 0, seatsPerTrain: 0 },
    mostAccurateShift: { emptySeats: 0, totalTrains: 0, seatsPerTrain: 0 },
  };
  if (!loadStatsFromLocalStorage()) {
    localStorage.setItem("shiftStats", JSON.stringify(defaultStats));
  }
};
