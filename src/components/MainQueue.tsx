// import { useEffect } from "react";
import { Group } from "../types/types";
import { RIDES } from "../context/settings";
const { QUEUE_SIZE } = RIDES.Guardians;


type MainQueueProps = {
    mainQueue: Group[];
    setMainQueue: React.Dispatch<React.SetStateAction<Group[]>>;
};

function MainQueue({ mainQueue, setMainQueue }: MainQueueProps) {
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
    );
};

export default MainQueue;
