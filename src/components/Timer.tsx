// src/components/timer.tsx
import { useEffect } from "react";

type TimerProps = {
    dispatchInterval: React.RefObject<number>;
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>
    sendTrain: () => void;
    isActive: boolean
};

function Timer({ dispatchInterval, timer, setTimer, sendTrain, isActive }: TimerProps) {
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    sendTrain();
                    return dispatchInterval.current ?? 0; // ✅ use .current, safe fallback
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [dispatchInterval, sendTrain, setTimer, isActive]);

    return <h1 className="current-number">{timer}</h1>;

};

export default Timer;
