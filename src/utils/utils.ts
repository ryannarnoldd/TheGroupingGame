import { Group } from "../types/types";
import { RIDES, COLORS } from "../context/settings"; // Assuming COLORS is exported from utils.ts

type RideKey = keyof typeof RIDES;
const COMMON_REQUESTS = [
  "Front",
  "Middle",
  "Back"
];

export function randomGroup(ride: RideKey): Group {
  const id = Math.floor(Math.random() * 1000);  

  const queueType = RIDES[ride].QUEUE_TYPE;
  const rideGroups = RIDES[ride].GROUP_SIZES
  const groupSizes = Object.keys(rideGroups).map(Number);

  // 90% chance of group being between 1-4
  const [min, max] = (Math.random() < 0.85) ? [1, 4] : [5, groupSizes.length]
  let size = Math.floor(Math.random() * (max - min + 1)) + min;
  if (queueType === "odd" && size % 2 === 0) size += 1;
  if (queueType === "even" && size % 2 !== 0) size += 1;
  size = Math.min(size, max);

  const listOfRequests = (rideGroups[size as keyof typeof rideGroups])

  const possibleRequests = [...COMMON_REQUESTS, ...listOfRequests]

  const color = COLORS[size % COLORS.length];
  const request = Math.random() < 0.8 ? undefined : possibleRequests[Math.floor(Math.random() * possibleRequests.length)] as Group["request"]

  return { id, size, color, request };
}