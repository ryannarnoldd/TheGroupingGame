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
    const bringFromQueue = (index: number, queue: keyof Queues) => {
        setMainQueue(prev => {
            const group = holdingQueues[queue][index];
            setHoldingQueues(qs => ({
                ...qs,
                [queue]: qs[queue].filter((_, i) => i !== index)
            }));

            return [group, ...prev.slice(0, -1)];
        });
        
    };

    const queueGroup = (queue: keyof Queues) => {
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
        // Loop through holding queues and only add as many as there is.
        // it is not only a, b, c. it could be more or less
        <div className="queue-container">
            {Object.keys(holdingQueues).map(q => (
                
                <div key={q} className="queue-column">
                    <h3 className="queue-header" onClick={() => queueGroup(q as keyof Queues)}>{q}</h3>
                    {(holdingQueues as Record<string, Group[]>)[q].map((g, index) => (
                        <div
                            key={index}
                            className="queued-group"
                            onClick={() => {
                                bringFromQueue(index, q as keyof Queues);
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
