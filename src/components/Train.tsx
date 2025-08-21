// src/components/Train.tsx
import { useEffect } from "react";
import { Seat, Group } from "../types/types";
import { RIDES } from "../context/settings";
const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FF69B4"]; // Example colors

type TrainProps = {
    seats: Seat[];
    setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
    mainQueue: Group[];
    setMainQueue: React.Dispatch<React.SetStateAction<Group[]>>;
    emptySeats: React.RefObject<number>;
    totalTrains: React.RefObject<number>;
    sendTrain: () => void;
    ride: "GOTG" | "SM" | "EE";
    nextGroup: () => void;
};

function Train({ seats, setSeats, mainQueue, sendTrain, ride, nextGroup }: TrainProps) {
    const { CARS, ROWS_PER_CAR, SEATS_PER_ROW } = RIDES[ride];

    useEffect(() => {
        // PREVENT FROM running when first mounts.
        if (seats.length === 0) return;

        const isTrainFull = seats.every(s => s.takenBy !== undefined);

        if (isTrainFull) {
            sendTrain();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seats]);

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

        setSeats(train);
    }, [setSeats]);

    const pickSeat = (seatId: number) => {
        setSeats(prev => {
            const selectedCount = prev.filter(s => s.isSelected).length;

            const updated = prev.map(seat => {
                if (seat.id !== seatId || seat.takenBy) return seat;
                if (!seat.isSelected && selectedCount >= mainQueue[0].size) return seat;
                return { ...seat, isSelected: !seat.isSelected };
            });

            const newSelectedCount = updated.filter(s => s.isSelected).length;

            if (newSelectedCount === mainQueue[0].size) {
                sendGroup();
            }

            return updated;
        });
    };

    // Send group to train
    const sendGroup = () => {
        setSeats(prev => {
            const updatedSeats = prev.map(s =>
                s.isSelected
                    ? { ...s, takenBy: mainQueue[0].id, isSelected: false }
                    : s
            );

            return updatedSeats;
        });

        nextGroup();
    };

    return (
        <div className="seating">
            <div className="train">
                {Array.from({ length: CARS }).map((_, carIndex) => {
                    const carSeats = seats.filter((_, i) => Math.floor(i / (ROWS_PER_CAR * SEATS_PER_ROW)) === carIndex);
                    return (
                        <div key={carIndex} className="car">
                            {Array.from({ length: ROWS_PER_CAR }).map((_, rowIndex) => {
                                const rowNum = carIndex * ROWS_PER_CAR + rowIndex + 1;
                                const rowSeats = carSeats.filter(s => s.row === rowNum);
                                return (
                                    <div key={rowNum} className="row">
                                        {/* <div className="row-number">{rowNum}</div> */}
                                        {rowSeats.map(seat => (
                                            <div
                                                key={seat.id}
                                                className={`seat ${seat.isSelected ? "selected" : ""} ${seat.takenBy ? "taken" : ""}`}
                                                style={{ backgroundColor: seat.takenBy ? COLORS[seat.takenBy % COLORS.length] : "" }}
                                                onClick={() => pickSeat(seat.id)}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Train;
