import { Group } from "../types/types";
import { RIDES, COLORS } from "../context/settings"; // Assuming COLORS is exported from utils.ts

type RideKey = keyof typeof RIDES;

export function randomGroup(ride: RideKey): Group {
  const rideQueue = RIDES[ride]?.QUEUE_TYPE;

  const REQUESTS: Group["request"][] = ["Front", "Back", "Row 1", "Row 9", "Odd", "Even", "Alone", "Together"];
  const id = Math.floor(Math.random() * 1000);
  const smallGroup = Math.random() < 0.85;
  const [min, max] = smallGroup ? [1, 6] : [5, 10];

  // Generate size respecting filter
  let size = Math.floor(Math.random() * (max - min + 1)) + min;
  if (rideQueue === "odd" && size % 2 === 0) size += 1;
  if (rideQueue === "even" && size % 2 !== 0) size += 1;
  size = Math.min(size, max);

  const color = COLORS[size % COLORS.length];
  const request = Math.random() < 0.8 ? undefined : REQUESTS[Math.floor(Math.random() * REQUESTS.length)];

  return { id, size, color, request };
}