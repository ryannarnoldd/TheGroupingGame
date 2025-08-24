import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Seat, Group, RideKey } from "./types/types"
import Train from "./components/Train";
import { randomGroup } from "./utils/utils";
import MainQueue from "./components/MainQueue";
import HoldingQueues from "./components/HoldingQueues";
import { loadStatsFromLocalStorage, saveStatsToLocalStorage } from "./lib/localStorage";
// import { getHighestAccuracy, getHighScore } from "./lib/stats";
import { RIDES } from "./context/settings";
import { getTotalSeats } from "./lib/rides";
import { HelpModal } from "./modals/HelpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { StatsModal } from "./modals/StatsModal";
import { AboutModal } from "./modals/AboutModal"
import Timer from "./components/Timer";

function App() {
  const rideKeys = Object.keys(RIDES);
  const [ride, setRide] = useState<RideKey>(rideKeys[0] as RideKey);


  const dispatchInterval = useRef(RIDES[ride].DISPATCH_INTERVAL);
  const [timer, setTimer] = useState(dispatchInterval.current);
  const [isTimerActive, setIsTimerActive] = useState(false)

  const [seats, setSeats] = useState<Seat[]>([]);

  // const numOfHoldingQueues = RIDES[ride].NUMBER_OF_HOLDINGEQUEUES
  const [holdingQueues, setHoldingQueues] = useState<{ [key in "A" | "B" | "C"]: Group[] }>({ A: [], B: [], C: [] });

  const emptySeats = useRef(0);
  const totalTrains = useRef(0);
  // ride will be any of the list of rideKeys.
  const [mainQueue, setMainQueue] = useState<Group[]>(Array.from({ length: 6 }, () => randomGroup(ride)));

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false)

  useEffect(() => {
    if (!loadStatsFromLocalStorage()) {
      setTimeout(async () => {
        setHelpModalOpen(true);
      }, 350);
    }
  }, []
  )

  const beginShift = () => {
    setTimer(dispatchInterval.current)
    setIsTimerActive(true)
  }

  useEffect(() => {
    // as of now, game continues.
    setMainQueue(Array.from({ length: 6 }, () => randomGroup(ride)));
  }, [ride]);

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
      seatsPerTrain: getTotalSeats(ride),
    });
    setStatsModalOpen(true);
    setIsTimerActive(false)

    // window.location.reload();
  };

  const nextGroup = () => {
    setMainQueue(prev => {
      const newQueue = prev.slice(1);
      // do not do "as ..."
      newQueue.push(randomGroup(ride));
      return newQueue;
    });
  };

  return (
    <>
      {/* why is this  */}
      <HelpModal isOpen={helpModalOpen} onClose={() => {setHelpModalOpen(false); setIsTimerActive(true)}} />
      <SettingsModal isOpen={settingsModalOpen} onClose={() => {setSettingsModalOpen(false); setIsTimerActive(true)}} ride={ride} setRide={setRide} endShift={endShift} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => {setAboutModalOpen(false); setIsTimerActive(true)}} />
      <StatsModal isOpen={statsModalOpen} onClose={() => {setStatsModalOpen(false); beginShift()}} currentShift={
        {
          emptySeats: emptySeats.current,
          totalTrains: totalTrains.current,
          seatsPerTrain: getTotalSeats(ride),
        }
      } />



      <div className="container">
        <h1>{ride}</h1>
        {/* Seating */}
        <Train seats={seats}
          setSeats={setSeats}
          mainQueue={mainQueue}
          setMainQueue={setMainQueue}
          emptySeats={emptySeats}
          totalTrains={totalTrains}
          sendTrain={sendTrain}
          ride={ride}
          nextGroup={nextGroup}
        />

        {/* Controls */}
        <div className="controls">

          <button style={{ backgroundColor: 'red', color: 'white' }}
            onClick={
              () => {
                endShift();
              }
            }
          >
            CLOCK OUT
          </button>

          <Timer dispatchInterval={dispatchInterval} timer={timer} setTimer={setTimer} sendTrain={sendTrain} isActive={isTimerActive} />

          <MainQueue mainQueue={mainQueue} setMainQueue={setMainQueue} ride={ride} />

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

          {/* Button to open up settings menu. */}
          <button onClick={() => {setHelpModalOpen(true); setIsTimerActive(false)}}>Help?</button>
          <button onClick={() => {setSettingsModalOpen(true); setIsTimerActive(false)}}>Settings</button>
          <button onClick={() => {setAboutModalOpen(true); setIsTimerActive(false)}}>About Me</button>
        </div>
      </div>
    </>
  );
}

export default App;
