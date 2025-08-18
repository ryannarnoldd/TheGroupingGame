import { useState, useEffect } from "react";
import "./App.css";

const COLORS = ["#FF9999", "#FFB3B3", "#FFCC99", "#FFFF99", "#CCFF99", "#99FFCC", "#99CCFF", "#CC99FF", "#FF99CC", "#FF99FF"];

type Group = {
  id: number;
  size: number;
  color: string;
  request?: "Front" | "Back" | "Row 1" | "Row 9" | "Odd" | "Even" | "Alone" | "Together";
};

type Seat = {
  id: number;
  row: number;
  takenBy?: number;
  isSelected?: boolean;
};

function randomGroup(filter: "all" | "odd" | "even"): Group {
  const REQUESTS: Group["request"][] = ["Front", "Back", "Row 1", "Row 9", "Odd", "Even", "Alone", "Together"];
  const id = Math.floor(Math.random() * 1000);
  const smallGroup = Math.random() < 0.8;
  const [min, max] = smallGroup ? [1, 6] : [5, 10];

  // Generate size respecting filter
  let size = Math.floor(Math.random() * (max - min + 1)) + min;
  if (filter === "odd" && size % 2 === 0) size += 1;
  if (filter === "even" && size % 2 !== 0) size += 1;
  size = Math.min(size, max);

  const color = COLORS[size % COLORS.length];
  const request = Math.random() < 0.9 ? undefined : REQUESTS[Math.floor(Math.random() * REQUESTS.length)];

  return { id, size, color, request };
}

function App() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [queues, setQueues] = useState<{ [key in "A" | "B" | "C"]: Group[] }>({ A: [], B: [], C: [] });
  const [filter, setFilter] = useState<"all" | "odd" | "even">("all");
  const [currentGroup, setCurrentGroup] = useState<Group>(() => randomGroup("all"));

  const CARS = 5;
  const ROWS_PER_CAR = 2;
  const SEATS_PER_ROW = 2;

  // Initialize train seats
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
  }, []);

  // Select/deselect seats
  const pickSeat = (seatId: number) => {
    setSeats(prev => {
      const selectedCount = prev.filter(s => s.isSelected).length;
      return prev.map(seat => {
        if (seat.id !== seatId || seat.takenBy) return seat;
        if (!seat.isSelected && selectedCount >= currentGroup.size) return seat;
        return { ...seat, isSelected: !seat.isSelected };
      });
    });
  };

  // Send group to train
  const sendGroup = () => {
    setSeats(prev =>
      prev.map(s => (s.isSelected ? { ...s, takenBy: currentGroup.id, isSelected: false } : s))
    );

    setCurrentGroup(randomGroup(filter));
  };

  // Queue group into A/B/C
  const queueGroup = (queueName: "A" | "B" | "C") => {
    setQueues(prev => ({ ...prev, [queueName]: [...prev[queueName], currentGroup] }));
    setCurrentGroup(randomGroup(filter));
    setSeats(prev => prev.map(s => ({ ...s, isSelected: false })));
  };

  // Clear the entire train
  const clearTrain = () => {
    setSeats(prev => prev.map(s => ({ ...s, takenBy: undefined, isSelected: false })));
    alert("Train cleared! New boarding started.");
  };

  return (
    <>
      <header>
        <h1>Grouping Game!</h1>
      </header>

      <div className="container">
        {/* Seating */}
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
                        <div className="row-number">{rowNum}</div>
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

        {/* Controls */}
        <div className="controls">
          <div className="filter">
            <label>Filter:</label>
            <select value={filter} onChange={e => setFilter(e.target.value as "all" | "odd" | "even")}>
              <option value="all">All</option>
              <option value="odd">Odd Rows</option>
              <option value="even">Even Rows</option>
            </select>
          </div>

          <div className="group-box">
            <h1>{currentGroup.size}</h1>
            <div className="request-text">{currentGroup.request && `Request: ${currentGroup.request}`}</div>
          </div>

          <button onClick={sendGroup}>NEXT</button>
          <button onClick={clearTrain}>SEND</button>

          {/* Queue columns */}
          <div className="queue-container">
            {(["A", "B", "C"] as const).map(q => (
              <div key={q} className="queue-column">
                <h3 className="queue-header" onClick={() => queueGroup(q)}>{q}</h3>
                {queues[q].map(g => (
                  <div
                    key={g.id}
                    className="queued-group"
                    onClick={() => {
                      setCurrentGroup(g);
                      setQueues(prev => ({ ...prev, [q]: prev[q].filter(gg => gg.id !== g.id) }));
                    }}
                  >
                    <b>{g.size}{g.request && `(${g.request})`}</b>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
