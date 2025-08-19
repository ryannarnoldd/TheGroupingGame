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
  const [mainQueue, setMainQueue] = useState<Group[]>(Array.from({ length: 6 }, () => randomGroup(filter)));
  const [emptySeats, setEmptySeats] = useState<number>(0);

  const CARS = 5;
  const ROWS_PER_CAR = 2;
  const SEATS_PER_ROW = 2;
  const QUEUE_SIZE = 6;

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


  // Remove the front element and adds randomGroup(filter) to thr end.
  // do it without my copy method.
  const updateMainQueue = () => {
    console.log('updateMainQueue func')
    setMainQueue(prev => {
      const newQueue = prev.slice(1);
      newQueue.push(randomGroup(filter));
      return newQueue;
    });
  };

  const nextGroup = () => {
    console.log('nextGroup func')
    updateMainQueue();
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

  const bringToFront = (index: number) => {
    setMainQueue(prev => {
      const group = prev[index];
      const newQueue = [group, ...prev.slice(0, index), ...prev.slice(index + 1)];
      return newQueue;
    });
  };

  const bringFromQueue = (index: number, queue: "A" | "B" | "C") => {
    setMainQueue(prev => {
      const group = queues[queue][index];
      setQueues(qs => ({
        ...qs,
        [queue]: qs[queue].filter((_, i) => i !== index)
      }));


      return [group, ...prev.slice(0, -1)];
    });
  };

  const queueGroup = (queue: "A" | "B" | "C") => {
    const group = mainQueue[0];

    setQueues(prev => {
      return {
        ...prev,
        [queue]: [...prev[queue], group]
      };
    });

    nextGroup();
  };

  const sendTrain = (full: boolean) => {
    if (!full) setEmptySeats(emptySeats + seats.filter(s => !s.takenBy).length);

    setSeats(prev =>
      prev.map(s => ({ ...s, takenBy: undefined, isSelected: false }))
    );
  };

  useEffect(() => {
  if (seats.length === 0) return; // guard for initial mount

  const isTrainFull = seats.every(s => s.takenBy !== undefined);

  if (isTrainFull) {
    console.log("Train is full, sending train...");
    sendTrain(true);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [seats]);

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

        {/* Controls */}
        <div className="controls">
          <div className="filter">
            <label>Filter:</label>
            {/* make it run randomgroup() on change too please  */}
            <select value={filter} onChange={e => {
              setFilter(e.target.value as "all" | "odd" | "even");
              setMainQueue(Array.from({ length: 6 }, () => randomGroup(e.target.value as "all" | "odd" | "even")));
            }}>
              <option value="all">All</option>
              <option value="odd">Odd Rows</option>
              <option value="even">Even Rows</option>
            </select>
          </div>

          <div className="queue-container">
            {/* Current group (big number) */}
            <div className="group-box">
              <div className="current-group">
                <h1 className="current-number">{mainQueue[0].size}</h1>
                <div className="request-text">
                  {mainQueue[0].request && `${mainQueue[0].request}`}
                </div>
              </div>
            </div>

            {/* Main queue (smaller numbers) */}
            {/* map them backwards please */}
            <div className="main-queue">
              {/* have the index start at 1 "i" and make the index the key to each div please. */}
              {mainQueue.slice(1, 6).reverse().map((g, index) => (
                <div
                  // have each key have an index, starting at 1.
                  // pass that index through bringtoFront.
                  key={index + 1}
                  className="tiny-number"
                  onClick={() => bringToFront(QUEUE_SIZE - index - 1)}
                >
                  {g.size}
                </div>
              ))}
            </div>
          </div>


          {/* <button onClick={sendGroup}>NEXT</button> */}
          <button onClick={() => sendTrain(false)}>SEND TRAIN</button>

          {/* Queue columns */}
          <div className="queue-container">
            {(["A", "B", "C"] as const).map(q => (
              <div key={q} className="queue-column">
                <h3 className="queue-header" onClick={() => queueGroup(q)}>{q}</h3>
                {queues[q].map((g, index) => (
                  <div
                    key={index}
                    className="queued-group"
                    onClick={() => {
                      bringFromQueue(index, q);
                    }}
                  >
                    <b>{g.size}{g.request && `(${g.request})`}</b>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Create a section for stats. */}
          <div className="stats">
            <h2>Total Empty Seats: {emptySeats}</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
