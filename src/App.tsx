import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { Seat, Group } from "./types/types";
import Train from "./components/Train";
import { randomGroup } from "./utils/groups";
import MainQueue from "./components/MainQueue";
import HoldingQueues from "./components/HoldingQueues";
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from "./lib/localStorage";
// import { getHighestAccuracy, getHighScore } from "./lib/stats";
import { HelpModal } from "./modals/HelpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { StatsModal } from "./modals/StatsModal";
import { AboutModal } from "./modals/AboutModal";
import Timer from "./components/Timer";
import { Alert } from "./modals/Alert";
import { nextGroupState } from "./utils/queues";
import { CustomRideModal } from "./modals/CustomRideModal";
import { getAllRides, getRide, getTotalSeats } from "./lib/rides";

function App() {
const rideKeys = Object.keys(getAllRides());
const [ride, setRide] = useState(rideKeys[0]);

  const dispatchInterval = useRef(getRide(ride).DISPATCH_INTERVAL);
  const [timer, setTimer] = useState(dispatchInterval.current);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [seats, setSeats] = useState<Seat[]>([]);
  const alternating = useRef(getRide(ride).ALTERNATING_QUEUE);
  const evenGroup = useRef(true);

  const [holdingQueues, setHoldingQueues] = useState<{
    [key: string]: Group[];
  }>({});

  const emptySeats = useRef(0);
  const totalTrains = useRef(0);

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  
  const [customRideModalOpen, setCustomRideFormOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(true);
  const [rowRequests, setRowRequests] = useState(true);

  const createQueue = (): Group[] => {
    const length = getRide(ride).QUEUE_SIZE;
    return Array.from({ length }, () =>
      randomGroup(ride, alternating.current, evenGroup.current, rowRequests)
    );
  };

  const originalQueue = createQueue();
  const [mainQueue, setMainQueue] = useState<Group[]>(originalQueue);

  // Mount.
  useEffect(() => {
    if (!loadStatsFromLocalStorage()) {
      setTimeout(async () => {
        setHelpModalOpen(true);
      }, 350);
    }
  }, []);

  const beginShift = useCallback(() => {
    if (!ride) return;

    dispatchInterval.current = getRide(ride).DISPATCH_INTERVAL;
    alternating.current = getRide(ride).ALTERNATING_QUEUE;
    evenGroup.current = true;

    const numOfHoldingQueues = getRide(ride).NUMBER_OF_HOLDINGQUEUES;

    // Dynamically generate keys A, B, C, ... based on numOfHoldingQueues
    const newHoldingQueues: { [key: string]: Group[] } = {};
    for (let i = 0; i < numOfHoldingQueues; i++) {
      const key = String.fromCharCode(65 + i); // 65 = "A"
      newHoldingQueues[key] = [];
    }

    setHoldingQueues(newHoldingQueues);
    setTimer(dispatchInterval.current);
    setIsTimerActive(true);
  }, [
    ride,
    setHoldingQueues,
    setTimer,
    setIsTimerActive,
  ]);

  // when the ride changes.
  useEffect(() => {
    beginShift();
  }, [beginShift]);

  const endShift = (showSummary: boolean = true) => {
    saveStatsToLocalStorage({
      emptySeats: emptySeats.current,
      totalTrains: totalTrains.current,
      seatsPerTrain: getTotalSeats(ride),
    });
    if (showSummary) setStatsModalOpen(true);
    setIsTimerActive(false);

    emptySeats.current = 0;
    totalTrains.current = 0;
  };

  const sendTrain = () => {
    emptySeats.current += seats.filter((s) => !s.takenBy).length;

    totalTrains.current += 1;

    setSeats((prev) =>
      prev.map((s) => ({ ...s, takenBy: undefined, isSelected: false })),
    );

    evenGroup.current = !evenGroup.current;
    setMainQueue(createQueue());

    setTimer(dispatchInterval.current);
  };

  const nextGroup = () => {
    setMainQueue((prev) => {
      return nextGroupState(prev, ride, alternating.current, evenGroup.current, rowRequests);
    });
  };

  return (
    <div className="scaling-wrapper">
      {/* why is this  */}
      <Alert
        isOpen={alertOpen}
        message={"You ran out of time!"}
        onClose={() => setAlertOpen(false)}
      />
      
      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => {
          setHelpModalOpen(false);
          setIsTimerActive(true);
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => {
          setSettingsModalOpen(false);
          setIsTimerActive(true);
        } }
        ride={ride}
        setRide={(newRide) => setRide(String(newRide))}
        endShift={endShift}
        beginShift={beginShift}
        currentTrains={totalTrains.current}
        setEasyMode={setEasyMode}
        easyMode={easyMode}
        rowRequests={rowRequests}
        setRowRequests={setRowRequests}
        setCustomRideForm={setCustomRideFormOpen}/>
        
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => {
          setAboutModalOpen(false);
          setIsTimerActive(true);
        }}
      />
      <StatsModal
        isOpen={statsModalOpen}
        onClose={() => {
          setStatsModalOpen(false);
          beginShift();
        }}
        currentShift={{
          emptySeats: emptySeats.current,
          totalTrains: totalTrains.current,
          seatsPerTrain: getTotalSeats(ride),
        }}
      />

      <CustomRideModal
        isOpen={customRideModalOpen}
        onClose={() => {
          setCustomRideFormOpen(false);
          setIsTimerActive(true);
        }}
        setRide={setRide}
      />

      <div className="container">
        {/* Seating */}
        <Train
          seats={seats}
          setSeats={setSeats}
          mainQueue={mainQueue}
          setMainQueue={setMainQueue}
          sendTrain={sendTrain}
          ride={ride}
          nextGroup={nextGroup}
        />

        {/* Controls */}
        <div className="controls">
          <h1>{ride}</h1>

          <button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => {
              endShift();
            }}
          >
            CLOCK OUT
          </button>

          {!easyMode && (
            <Timer
              dispatchInterval={dispatchInterval}
              timer={timer}
              setTimer={setTimer}
              sendTrain={sendTrain}
              isActive={isTimerActive}
              setAlertOpen={setAlertOpen}
            />
          )}

          <MainQueue
            mainQueue={mainQueue}
            setMainQueue={setMainQueue}
            ride={ride}
            alternating={alternating}
            evenGroup={evenGroup}
          />

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
          <button
            onClick={() => {
              setIsTimerActive(false);
              setHelpModalOpen(true);
            }}
          >
            Help?
          </button>
          <button
            onClick={() => {
              setIsTimerActive(false);
              setSettingsModalOpen(true);
            }}
          >
            Settings
          </button>
          <button
            onClick={() => {
              setIsTimerActive(false);
              setCustomRideFormOpen(true);
            }}
          >
            Custom Ride(?)
          </button>
          <button
            onClick={() => {
              setIsTimerActive(false);
              setAboutModalOpen(true);
            }}
          >
            About Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
