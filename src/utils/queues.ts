  import { Group, RideKey } from "../types/types";
  import { randomGroup } from "./groups";
  // import { RIDES } from "../context/settings";

export function nextGroupState(queue: Group[], ride: RideKey, alternating: boolean, evenGroup: boolean, rowRequests: boolean): Group[] {
    const newQueue = queue.slice(1);
    newQueue.push(randomGroup(ride, alternating, evenGroup, rowRequests));
    return newQueue;
};