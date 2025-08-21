import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Seat, Group } from "./types/types"
import Train from "./components/Train";
import { randomGroup } from "./utils/utils";
import MainQueue from "./components/MainQueue";
import HoldingQueues from "./components/HoldingQueues";
import { initializeStats, loadStatsFromLocalStorage, saveStatsToLocalStorage } from "./lib/localStorage";
import { getHighestAccuracy, getHighScore } from "./lib/stats";
import { RIDES } from "./context/settings";
import { getTotalSeats } from "./lib/rides";

function App() {
  // get list of keys from RIDES
  const rideKeys = Object.keys(RIDES);

  const [seats, setSeats] = useState<Seat[]>([]);


  const [holdingQueues, setHoldingQueues] = useState<{ [key in "A" | "B" | "C"]: Group[] }>({ A: [], B: [], C: [] });
  const emptySeats = useRef(0);
  const totalTrains = useRef(0);
  // ride will be any of the list of rideKeys.
  const [ride, setRide] = useState<string>(rideKeys[0]);
  const [mainQueue, setMainQueue] = useState<Group[]>(Array.from({ length: 6 }, () => randomGroup(ride as "GOTG" | "SM" | "EE")));


  // use effect to run initializeStats.
  useEffect(() => {
    const shiftsDone = loadStatsFromLocalStorage()?.totalShifts || 0;

    if (shiftsDone === 0) {
      alert(
        "How to Play!\n\n" +
        "• Click seats to place each group (keep them together if possible).\n" +
        "• Need a different size? Click a number (1–5) to bring that group forward.\n" +
        "• To set a group aside, click the queue letter under their size. Click again to reuse them.\n" +
        "• Clock in to start. Done? Clock out to finish!"
      );
    }

    initializeStats();

  }, []);

  const sendTrain = () => {
    emptySeats.current += seats.filter(s => !s.takenBy).length;

    totalTrains.current += 1;

    setSeats(prev => prev.map(s => ({ ...s, takenBy: undefined, isSelected: false })));
  };

  const endShift = () => {
    // Save stats to local storage or perform any cleanup
    saveStatsToLocalStorage({
      emptySeats: emptySeats.current,
      totalTrains: totalTrains.current,
      seatsPerTrain: getTotalSeats(ride as "GOTG" | "SM" | "EE"),
    });

    const allStats = loadStatsFromLocalStorage();
    alert(`
    Shift ended!!
    Empty Seats: ${emptySeats.current || 0}
    Total Trains: ${totalTrains.current || 0}

    Highest Shift: ${(allStats ? getHighScore(allStats) : 0)}
    Most Accurate Shift: ${(allStats ? getHighestAccuracy(allStats) : 0)}%

    Total Shifts: ${(allStats ? allStats.totalShifts : 0)}
    `);

    window.location.reload();
  };

  const nextGroup = () => {
    alert('removing from main queue');
    setMainQueue(prev => {
        const newQueue = prev.slice(1);
        newQueue.push(randomGroup(ride as "GOTG" | "SM" | "EE"));
        return newQueue;
    });
    };

  return (
    <>
      <div className="container">
        {/* Seating */}
        <Train seats={seats}
          setSeats={setSeats}
          mainQueue={mainQueue}
          setMainQueue={setMainQueue}
          emptySeats={emptySeats}
          totalTrains={totalTrains}
          sendTrain={sendTrain}
          ride={ride as "GOTG" | "SM" | "EE"}
          nextGroup={nextGroup}
        />

        {/* Controls */}
        <div className="controls">
          <div className="filter">
            <label>Ride:</label>
            <select value={ride} onChange={e => {
              console.log(e.target.value);
              setRide("GOTG");
              // pass through ride type
              setMainQueue(Array.from({ length: 6 }, () => randomGroup("GOTG" as "GOTG" | "SM" | "EE")));
            }}>
              <option value="GOTG">Guardians</option>
              <option value="SM">Space Mountain</option>
              <option value="EE">Expedition Everest</option>
            </select>
          </div>

          <MainQueue mainQueue={mainQueue} setMainQueue={setMainQueue} ride={ride as "GOTG" | "SM" | "EE"} />

          <button onClick={() => sendTrain()}>SEND TRAIN</button>

          {/* Queue columns */}
          <HoldingQueues 
            holdingQueues={holdingQueues} 
            setHoldingQueues={setHoldingQueues} 
            mainQueue={mainQueue} 
            setMainQueue={setMainQueue} 
            nextGroup={nextGroup} 
          />

          {/* Create a section for stats. */}
          <div className="stats">
            <h2>Total Empty Seats: {emptySeats.current ?? 0}</h2>
          </div>

          {/* button that onclick, will run a function to "clock out", save stats to local storage */}
          <button onClick={() => endShift()}>
            CLOCK OUT
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
