import { RIDES } from "../lib/rides";
import { Ride } from "../types/types";

export function getAllRides(): Record<string, Ride> {
  const customRides = JSON.parse(
    localStorage.getItem("customRides") ?? "{}"
  );

  return {
    ...RIDES,
    ...customRides,
  };
}

export function getRide(key: string): Ride {
  return getAllRides()[key];
}