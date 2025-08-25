import { useEffect } from "react";

type TimerProps = {
    dispatchInterval: React.RefObject<number>
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  sendTrain: () => void;
  isActive: boolean;
};

function Timer({ dispatchInterval, timer, setTimer, sendTrain, isActive }: TimerProps) {

  useEffect(() => {
    if (!isActive) return;

    setTimeout(() => {
      if (timer <= 1) {
        sendTrain();
        setTimer(dispatchInterval.current)
      } else {
        setTimer(timer - 1);
      }
    }, 1000);

  }, [timer, isActive, setTimer, dispatchInterval, sendTrain]);


  return <h1 className="current-number">{timer}</h1>;
}

export default Timer;
