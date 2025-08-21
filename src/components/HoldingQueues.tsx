import { Group } from "../types/types";
import { Queues } from "../types/types";

type HoldingQueuesProps = {
    holdingQueues: Queues;
    setHoldingQueues: React.Dispatch<React.SetStateAction<Queues>>;
    mainQueue: Group[];
    setMainQueue: React.Dispatch<React.SetStateAction<Group[]>>;
    nextGroup: () => void;
};

function HoldingQueues({ holdingQueues, setHoldingQueues, mainQueue, setMainQueue, nextGroup }: HoldingQueuesProps) {
    const bringFromQueue = (index: number, queue: "A" | "B" | "C") => {
        setMainQueue(prev => {
            const group = holdingQueues[queue][index];
            setHoldingQueues(qs => ({
                ...qs,
                [queue]: qs[queue].filter((_, i) => i !== index)
            }));

            return [group, ...prev.slice(0, -1)];
        });
        
    };

    const queueGroup = (queue: "A" | "B" | "C") => {
        const group = mainQueue[0];

        setHoldingQueues(prev => {
            return {
                ...prev,
                [queue]: [...prev[queue], group]
            };
        });

        nextGroup();
    };

    return (
        <div className="queue-container">
            {(["A", "B", "C"] as const).map(q => (
                <div key={q} className="queue-column">
                    <h3 className="queue-header" onClick={() => queueGroup(q)}>{q}</h3>
                    {holdingQueues[q].map((g, index) => (
                        <div
                            key={index}
                            className="queued-group"
                            onClick={() => {
                                bringFromQueue(index, q);
                            }}
                        >
                            <b>{g.size}{g.request && `(${g.request})`}</b>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default HoldingQueues;
