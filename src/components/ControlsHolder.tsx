// import { useEffect } from "react";
import { Group } from "../types/types";
import { RIDES } from "../context/settings";
const { QUEUE_SIZE } = RIDES.Guardians;


type ControlsHolderProps = {
    ControlsHolder: Group[];
    setControlsHolder: React.Dispatch<React.SetStateAction<Group[]>>;
};

function ControlsHolder({ ControlsHolder, setControlsHolder }: ControlsHolderProps) {
    const bringToFront = (index: number) => {
        setControlsHolder(prev => {
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
                    <h1 className="current-number">{ControlsHolder[0].size}</h1>
                    <div className="request-text">
                        {ControlsHolder[0].request && `${ControlsHolder[0].request}`}
                    </div>
                </div>
            </div>

            {/* Main queue (smaller numbers) */}
            {/* map them backwards please */}
            <div className="main-queue">
                {/* have the index start at 1 "i" and make the index the key to each div please. */}
                {ControlsHolder.slice(1, 6).reverse().map((g, index) => (
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

export default ControlsHolder;
