import { Group } from "../types/types";
import { RIDES, COLORS } from "../context/settings";

type RideKey = keyof typeof RIDES;

export function randomGroup(
  ride: RideKey,
  alternating: boolean,
  evenGroup: boolean,
): Group {
  // Decide type: all, even, or odd
  const type = !alternating ? "all" : evenGroup ? "even" : "odd";

  const id = Math.floor(Math.random() * 1000);

  const rideGroups = RIDES[ride].GROUP_SIZES;
  const groupSizes = Object.keys(rideGroups).map(Number);

  // Favor smaller groups most of the time
  const [min, max] = Math.random() < 0.85 ? [1, 4] : [5, groupSizes.length];

  // Build candidate group sizes
  let possibleSizes = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  if (type === "odd") possibleSizes = possibleSizes.filter((n) => n % 2 === 1);
  if (type === "even") possibleSizes = possibleSizes.filter((n) => n % 2 === 0);

  // Fallback if filtering left us empty
  if (possibleSizes.length === 0) {
    possibleSizes = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }

  // Pick final size
  const size = possibleSizes[Math.floor(Math.random() * possibleSizes.length)];

  // Assign color
  const color = COLORS[size % COLORS.length];

  // Random request (occasionally none)
  const request =
    Math.random() < 0.85 || rideGroups[size].length === 0
      ? undefined
      : rideGroups[size][Math.floor(Math.random() * rideGroups[size].length)];

  return { id, size, color, request };
}
