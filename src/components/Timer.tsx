import { useEffect } from "react";

type TimerProps = {
    dispatchInterval: React.RefObject<number>
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  sendTrain: () => void;
  isActive: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Timer({ dispatchInterval, timer, setTimer, sendTrain, isActive, setAlertOpen }: TimerProps) {

  useEffect(() => {
    if (!isActive) return;

    setTimeout(async () => {
      if (timer <= 1) {
        // do an alert for 2 seconds.
        setAlertOpen(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAlertOpen(false);

        sendTrain();
        setTimer(dispatchInterval.current)
      } else {
        setTimer(timer - 1);
      }
    }, 1000);

  }, [timer, isActive, setTimer, dispatchInterval, sendTrain, setAlertOpen]);


  return <h1 className="current-number">{timer}</h1>;
}

export default Timer;
