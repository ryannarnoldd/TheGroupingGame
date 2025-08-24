// src/components/DispatchInterval.tsx
import { useEffect, useState } from "react";

// type DispatchIntervalProps = {
    
// };

function DispatchInterval() {
    const [dispatchInterval, setDispatchInterval] = useState(60);

    useEffect(() => {
        setTimeout(() => {
            setDispatchInterval(dispatchInterval - 1)
        }, 1000)
    }, [dispatchInterval]);

    return (
        <h1 className="current-number">{dispatchInterval}</h1>
    );
};

export default DispatchInterval;
