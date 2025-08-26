// src/components/Train.tsx
import { useEffect } from "react";
import { Seat, Group, RideKey } from "../types/types";
import { RIDES } from "../context/settings";

const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FF69B4"];

type TrainProps = {
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  mainQueue: Group[];
  setMainQueue: React.Dispatch<React.SetStateAction<Group[]>>;
  sendTrain: () => void;
  ride: RideKey;
  nextGroup: () => void;
};

function Train({
  seats,
  setSeats,
  mainQueue,
  sendTrain,
  ride,
  nextGroup,
}: TrainProps) {
  const { CARS, ROWS_PER_CAR, SEATS_PER_ROW } = RIDES[ride];

  // Initialize train layout
  useEffect(() => {
    const train: Seat[] = [];
    let seatId = 1;
    let rowNum = 1;

    for (let car = 0; car < CARS; car++) {
      for (let row = 0; row < ROWS_PER_CAR; row++) {
        for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
          train.push({ id: seatId++, row: rowNum });
        }
        rowNum++;
      }
    }

    console.log(train);

    setSeats(train);
  }, [CARS, ROWS_PER_CAR, SEATS_PER_ROW, setSeats]);

  // Handle seat selection
  const pickSeat = (seatId: number) => {
    if (mainQueue.length === 0) return;

    const group = mainQueue[0];

    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id !== seatId || seat.takenBy) return seat;

        const selectedCount = prev.filter((s) => s.isSelected).length;
        if (!seat.isSelected && selectedCount >= group.size) return seat;

        return { ...seat, isSelected: !seat.isSelected };
      }),
    );
  };

  // Auto-send group and train when conditions are met
  useEffect(() => {
    if (mainQueue.length === 0) return;

    const group = mainQueue[0];
    if (!group) return;

    const selectedSeats = seats.filter((s) => s.isSelected);

    // If group has enough seats chosen
    if (selectedSeats.length === group.size) {
      const requestFulfilled =
        !group.request ||
        selectedSeats.every((seat) => seat.row === group.request);

      if (requestFulfilled) {
        // Send group
        const groupId = group.id;

        // Assign seats
        setSeats((prev) =>
          prev.map((s) =>
            s.isSelected ? { ...s, takenBy: groupId, isSelected: false } : s,
          ),
        );

        // Remove current group and add a new one
        nextGroup();
      }
    }

    // Auto-send train if all seats are taken
    if (seats.length > 0 && seats.every((s) => s.takenBy !== undefined)) {
      sendTrain();
    }
  }, [seats, mainQueue, sendTrain, nextGroup, setSeats]);

  return (
    <div className="seating">
      <div className="train">
        {Array.from({ length: CARS }).map((_, carIndex) => {
          const accCarIndex = CARS - 1 - carIndex;
          const carSeats = seats.filter(
            (_, i) =>
              Math.floor(i / (ROWS_PER_CAR * SEATS_PER_ROW)) === accCarIndex,
          );

          // Reverse the rows for display
          const rowsArray = Array.from({ length: ROWS_PER_CAR })
            .map((_, rowIndex) => {
              const rowNum = accCarIndex * ROWS_PER_CAR + rowIndex + 1;
              const rowSeats = carSeats.filter((s) => s.row === rowNum);
              return { rowNum, rowSeats };
            })
            .reverse(); // This reverses the visual order of the rows

          return (
            <div key={accCarIndex} className="car">
              {rowsArray.map(({ rowNum, rowSeats }) => (
                <div key={rowNum} className="row">
                  {rowSeats
                    .slice()
                    .reverse()
                    .map((seat) => (
                      <div
                        key={seat.id}
                        className={`seat ${seat.isSelected ? "selected" : ""} ${seat.takenBy ? "taken" : ""}`}
                        style={{
                          backgroundColor: seat.takenBy
                            ? COLORS[seat.takenBy % COLORS.length]
                            : "",
                        }}
                        onClick={() => pickSeat(seat.id)}
                      />
                    ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Train;
