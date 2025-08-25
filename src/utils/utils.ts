import { Group } from "../types/types";
import { RIDES, COLORS } from "../context/settings"; // Assuming COLORS is exported

type RideKey = keyof typeof RIDES;
const COMMON_REQUESTS = ["Front", "Middle", "Back"];

export function randomGroup(
  ride: RideKey,
  alternating: boolean,
  evenGroup: boolean
): Group {
  // Determine type
  const type = !alternating ? "all" : evenGroup ? "even" : "odd";

  const id = Math.floor(Math.random() * 1000);

  const rideGroups = RIDES[ride].GROUP_SIZES;
  const groupSizes = Object.keys(rideGroups).map(Number);

  // Determine min/max for small or large group
  const [min, max] = Math.random() < 0.85 ? [1, 4] : [5, groupSizes.length];

  let size: number;

  if (type === "all") {
    size = Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    // generate all possible sizes that match parity
    let possibleSizes = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    if (type === "odd") possibleSizes = possibleSizes.filter(n => n % 2 === 1);
    if (type === "even") possibleSizes = possibleSizes.filter(n => n % 2 === 0);

    // fallback if no possible size matches (rare)
    if (possibleSizes.length === 0) possibleSizes = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    size = possibleSizes[Math.floor(Math.random() * possibleSizes.length)];
  }

  const listOfRequests = rideGroups[size as keyof typeof rideGroups];
  const possibleRequests = [...COMMON_REQUESTS, ...listOfRequests];

  const color = COLORS[size % COLORS.length];

  const request =
    Math.random() < 0.8
      ? undefined
      : possibleRequests[Math.floor(Math.random() * possibleRequests.length)] as Group["request"];

  return { id, size, color, request };
}