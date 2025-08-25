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
import { Alert } from "./modals/Alert";

function App() {
  const rideKeys = Object.keys(RIDES);
  const [ride, setRide] = useState<RideKey>(rideKeys[0] as RideKey);


  const dispatchInterval = useRef(RIDES[ride].DISPATCH_INTERVAL);
  const [timer, setTimer] = useState(dispatchInterval.current);
  const [isTimerActive, setIsTimerActive] = useState(false)

  const [seats, setSeats] = useState<Seat[]>([]);
  const alternating = useRef(RIDES[ride].ALTERNATING_QUEUE)
  const evenGroup = useRef(true)

  // const numOfHoldingQueues = RIDES[ride].NUMBER_OF_HOLDINGEQUEUES
const [holdingQueues, setHoldingQueues] = useState<{ [key: string]: Group[] }>({});

  const emptySeats = useRef(0);
  const totalTrains = useRef(0);
  // ride will be any of the list of rideKeys.

  const createQueue = (): Group[] => {
    const length = RIDES[ride].QUEUE_SIZE;
    console.log("I CREATE QUQE")
    return Array.from({ length }, () => randomGroup(ride, alternating.current, evenGroup.current))
  };

  const originalQueue = createQueue()
  const [mainQueue, setMainQueue] = useState<Group[]>(originalQueue);

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // Mount.
  useEffect(() => {
    if (!loadStatsFromLocalStorage()) {
      setTimeout(async () => {
        setHelpModalOpen(true);
      }, 350);
    }
    setIsTimerActive(true);
  }, []);

  // when the ride changes.
  useEffect(() => {
    // update the 
    dispatchInterval.current = RIDES[ride].DISPATCH_INTERVAL;
    alternating.current = RIDES[ride].ALTERNATING_QUEUE
    evenGroup.current = true;

const numOfHoldingQueues = RIDES[ride].NUMBER_OF_HOLDINGEQUEUES;

// Dynamically generate keys A, B, C, ... based on numOfHoldingQueues
const newHoldingQueues: { [key: string]: Group[] } = {};

for (let i = 0; i < numOfHoldingQueues; i++) {
  const key = String.fromCharCode(65 + i); // 65 = "A"
  newHoldingQueues[key] = [];
}

// Update state
setHoldingQueues(newHoldingQueues);

}, [ride]);

  const beginShift = () => {
    setTimer(dispatchInterval.current)
    setIsTimerActive(true)
  }

  const sendTrain = () => {
    emptySeats.current += seats.filter(s => !s.takenBy).length;

    totalTrains.current += 1;

    setSeats(prev => prev.map(s => ({ ...s, takenBy: undefined, isSelected: false })));

    evenGroup.current = !evenGroup.current
    setMainQueue(createQueue())

    setTimer(dispatchInterval.current)

  };

  const endShift = (showSummary: boolean = true) => {
    saveStatsToLocalStorage({
      emptySeats: emptySeats.current,
      totalTrains: totalTrains.current,
      seatsPerTrain: getTotalSeats(ride),
    });
    if (showSummary) setStatsModalOpen(true);
    setIsTimerActive(false)

  };

  const nextGroup = () => {
    setMainQueue(prev => {
      const newQueue = prev.slice(1);
      newQueue.push(randomGroup(ride, alternating.current, evenGroup.current));
      return newQueue;
    });
  };

  return (
    <>
      {/* why is this  */}
      <Alert isOpen={alertOpen} message={"You ran out of time!"} onClose={() => setAlertOpen(false)} />
      <HelpModal isOpen={helpModalOpen} onClose={() => { setHelpModalOpen(false); setIsTimerActive(true) }} />
      <SettingsModal isOpen={settingsModalOpen} onClose={() => { setSettingsModalOpen(false); setIsTimerActive(true) }} ride={ride} setRide={setRide} endShift={endShift} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => { setAboutModalOpen(false); setIsTimerActive(true) }} />
      <StatsModal isOpen={statsModalOpen} onClose={() => { setStatsModalOpen(false); beginShift() }} currentShift={
        {
          emptySeats: emptySeats.current,
          totalTrains: totalTrains.current,
          seatsPerTrain: getTotalSeats(ride),
        }
      } />



      <div className="container">

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
          <h1>{ride}</h1>

          <button style={{ backgroundColor: 'red', color: 'white' }}
            onClick={
              () => {
                endShift();
              }
            }
          >
            CLOCK OUT
          </button>

          <Timer dispatchInterval={dispatchInterval} timer={timer} setTimer={setTimer} sendTrain={sendTrain} isActive={isTimerActive} setAlertOpen={setAlertOpen} />

          <MainQueue mainQueue={mainQueue} setMainQueue={setMainQueue} ride={ride} alternating={alternating} evenGroup={evenGroup} />

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
          <button onClick={() => { setIsTimerActive(false); setHelpModalOpen(true);}}>Help?</button>
          <button onClick={() => { setIsTimerActive(false); setSettingsModalOpen(true);}}>Settings</button>
          <button onClick={() => { setIsTimerActive(false); setAboutModalOpen(true);}}>About Me</button>
        </div>
      </div>
    </>
  );
}

export default App;