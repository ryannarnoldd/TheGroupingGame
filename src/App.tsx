import { useState, useRef } from "react";
import "./App.css";
import { Seat, Group } from "./types/types"
import Train from "./components/Train";
import { randomGroup } from "./utils/utils";
import MainQueue from "./components/MainQueue";
import HoldingQueues from "./components/HoldingQueues";

function App() {
  const [filter, setFilter] = useState<"all" | "odd" | "even">("all");

  const [seats, setSeats] = useState<Seat[]>([]);
  const [mainQueue, setMainQueue] = useState<Group[]>(Array.from({ length: 6 }, () => randomGroup(filter)));

  const [holdingQueues, setHoldingQueues] = useState<{ [key in "A" | "B" | "C"]: Group[] }>({ A: [], B: [], C: [] });
  const emptySeats = useRef<number>(0);

  return (
    <>
      <div className="container">
        {/* Seating */}
        <Train seats={seats} setSeats={setSeats} mainQueue={mainQueue} setMainQueue={setMainQueue} emptySeats={emptySeats} />

        {/* Controls */}
        <div className="controls">
          <div className="filter">
            <label>Filter:</label>
            <select value={filter} onChange={e => {
              setFilter(e.target.value as "all" | "odd" | "even");
              setMainQueue(Array.from({ length: 6 }, () => randomGroup(e.target.value as "all" | "odd" | "even")));
            }}>
              <option value="all">All</option>
              <option value="odd">Odd Rows</option>
              <option value="even">Even Rows</option>
            </select>
          </div>

          <MainQueue mainQueue={mainQueue} setMainQueue={setMainQueue} />

          <button /*onClick={() => sendTrain(false)}*/>SEND TRAIN</button>

          {/* Queue columns */}
          <HoldingQueues holdingQueues={holdingQueues} setHoldingQueues={setHoldingQueues} mainQueue={mainQueue} setMainQueue={setMainQueue} />

          {/* Create a section for stats. */}
          <div className="stats">
            <h2>Total Empty Seats: {emptySeats.current ?? 0}</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
