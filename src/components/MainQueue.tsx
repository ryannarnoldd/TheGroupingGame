// import { useEffect } from "react";
import { Group, RideKey } from "../types/types";
import { RIDES } from "../context/settings";


type MainQueueProps = {
    mainQueue: Group[];
    ride: RideKey; // Ride type as string
    // setMainQueue is a function to update the main queue state
    setMainQueue: React.Dispatch<React.SetStateAction<Group[]>>;
};

function MainQueue({ mainQueue, setMainQueue, ride }: MainQueueProps) {
    const { QUEUE_SIZE } = RIDES[ride];

    const bringToFront = (index: number) => {
        setMainQueue(prev => {
            const group = prev[index];
            const newQueue = [group, ...prev.slice(0, index), ...prev.slice(index + 1)];
            return newQueue;
        });
    };

    return (
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
                {mainQueue.slice(1, QUEUE_SIZE).reverse().map((g, index) => (
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
    );
};

export default MainQueue;
