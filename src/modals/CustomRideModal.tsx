import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RIDES } from "../lib/rides";
import { Ride } from "../types/types";
import { BaseModal } from "./BaseModal";
import { createGroupSizings } from "../lib/rides";

type CustomRideFormProps = {
  isOpen: boolean;
  onClose: () => void;
  setRide?: (rideKey: string) => void;
};

function saveRideToLocalStorage(rideKey: string, rideData: Ride) {
  const existingRides = JSON.parse(
    localStorage.getItem("customRides") || "{}"
  );

  existingRides[rideKey] = rideData;

  localStorage.setItem("customRides", JSON.stringify(existingRides));
}

function loadAllRidesFromLocalStorage(): Record<string, Ride> {
  return JSON.parse(localStorage.getItem("customRides") || "{}");
}

export const CustomRideModal = ({
  isOpen,
  onClose,
  setRide,
}: CustomRideFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_customRides, setCustomRides] = useState<Record<string, Ride>>({});

  const [form, setForm] = useState({
    name: RIDES.GOTG.NAME,
    cars: RIDES.GOTG.CARS,
    rowsPerCar: RIDES.GOTG.ROWS_PER_CAR,
    seatsPerRow: RIDES.GOTG.SEATS_PER_ROW,
    dispatchInterval: RIDES.GOTG.DISPATCH_INTERVAL,
    queueSize: RIDES.GOTG.QUEUE_SIZE,
    holdingQueues: RIDES.GOTG.NUMBER_OF_HOLDINGQUEUES,
    alternatingQueue: RIDES.GOTG.ALTERNATING_QUEUE,
    groupSizes: RIDES.GOTG.GROUP_SIZES || {},
  });

  useEffect(() => {
    setCustomRides(loadAllRidesFromLocalStorage());
  }, []);

  const handleChange = (
    field: keyof typeof form,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const rideKey = form.name.replace(/\s+/g, "_").toUpperCase();

    const rideData: Ride = {
      NAME: form.name,
      CARS: Number(form.cars),
      ROWS_PER_CAR: Number(form.rowsPerCar),
      SEATS_PER_ROW: Number(form.seatsPerRow),
      QUEUE_SIZE: Number(form.queueSize),
      NUMBER_OF_HOLDINGQUEUES: Number(form.holdingQueues),
      DISPATCH_INTERVAL: Number(form.dispatchInterval),
      ALTERNATING_QUEUE: form.alternatingQueue,
      GROUP_SIZES: createGroupSizings( Number(form.seatsPerRow), Number(form.rowsPerCar), Number(form.seatsPerRow)),
    };

    saveRideToLocalStorage(rideKey, rideData);

    setCustomRides((prev) => ({
      ...prev,
      [rideKey]: rideData,
    }));

    setForm({
      name: RIDES.GOTG.NAME,
      cars: RIDES.GOTG.CARS,
      rowsPerCar: RIDES.GOTG.ROWS_PER_CAR,
      seatsPerRow: RIDES.GOTG.SEATS_PER_ROW,
      dispatchInterval: RIDES.GOTG.DISPATCH_INTERVAL,
      queueSize: RIDES.GOTG.QUEUE_SIZE,
      holdingQueues: RIDES.GOTG.NUMBER_OF_HOLDINGQUEUES,
      alternatingQueue: RIDES.GOTG.ALTERNATING_QUEUE,
      groupSizes: RIDES.GOTG.GROUP_SIZES || {},
    });

    setRide?.(rideKey);
    onClose();
  };

  return (
    <BaseModal
      title="Create Custom Ride"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Cars</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={10}
            value={form.cars}
            onChange={(e) => handleChange("cars", Number(e.target.value))}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Rows per Car</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={10}
            value={form.rowsPerCar}
            onChange={(e) =>
              handleChange("rowsPerCar", Number(e.target.value))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Seats per Row</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={10}
            value={form.seatsPerRow}
            onChange={(e) =>
              handleChange("seatsPerRow", Number(e.target.value))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Queue Size</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={20}
            value={form.queueSize}
            onChange={(e) =>
              handleChange("queueSize", Number(e.target.value))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Holding Queues</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={5}
            value={form.holdingQueues}
            onChange={(e) =>
              handleChange("holdingQueues", Number(e.target.value))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Dispatch Interval (sec)</Form.Label>
          <Form.Control
            type="number"
            min={5}
            max={60}
            value={form.dispatchInterval}
            onChange={(e) =>
              handleChange("dispatchInterval", Number(e.target.value))
            }
          />
        </Form.Group>

        <Form.Group
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Form.Check
            type="switch"
            label="Alternating Queue"
            checked={form.alternatingQueue}
            onChange={(e) =>
              handleChange("alternatingQueue", e.target.checked)
            }
          />
        </Form.Group>
      </div>

      <Button
        className="mt-3 w-100"
        onClick={handleSave}
      >
        Save Custom Ride
      </Button>
    </BaseModal>
  );
};