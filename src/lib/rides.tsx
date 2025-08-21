import { RIDES } from "../context/settings";

type RideKey = keyof typeof RIDES;

export const getTotalSeats = (rideKey: RideKey) => {
    const ride = RIDES[rideKey];
    if (!ride) return 0;

    return ride.CARS * ride.ROWS_PER_CAR * ride.SEATS_PER_ROW;
};
