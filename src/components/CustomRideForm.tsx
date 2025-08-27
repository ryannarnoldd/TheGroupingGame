// import { useState, useEffect } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { Ride } from "../types/types";
// import RIDES from "../context/rides.json";
// import { saveRideToLocalStorage, loadAllRidesFromLocalStorage } from "../lib/localStorage";
// // import { createGroupSizings } from "../utils/groups";

// type CustomRideFormProps = {
//   isOpen: boolean;
//   onClose?: () => void;
//   setRide?: (rideKey: string) => void;
// };

// export const CustomRideForm = ({ isOpen, onClose, setRide }: CustomRideFormProps) => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [_customRides, setCustomRides] = useState<Record<string, Ride>>({});
//   const GOTG = RIDES.GOTG;

//   const [form, setForm] = useState({
//     name: GOTG.NAME,
//     cars: GOTG.CARS,
//     rowsPerCar: GOTG.ROWS_PER_CAR,
//     seatsPerRow: GOTG.SEATS_PER_ROW,
//     dispatchInterval: GOTG.DISPATCH_INTERVAL,
//     queueSize: GOTG.QUEUE_SIZE,
//     holdingQueues: GOTG.NUMBER_OF_HOLDINGEQUEUES,
//     alternatingQueue: GOTG.ALTERNATING_QUEUE,
//   });

//   useEffect(() => {
//     setCustomRides(loadAllRidesFromLocalStorage());
//   }, []);

//   const handleChange = (field: keyof typeof form, value: string | number | boolean) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleSave = () => {
//     if (!form.name) return;

//     const rideKey = form.name.replace(/\s+/g, "_").toUpperCase(); // use name as key
//     const rideData: Ride = {
//       NAME: form.name,
//       CARS: Number(form.cars),
//       ROWS_PER_CAR: Number(form.rowsPerCar),
//       SEATS_PER_ROW: Number(form.seatsPerRow),
//       QUEUE_SIZE: Number(form.queueSize),
//       NUMBER_OF_HOLDINGEQUEUES: Number(form.holdingQueues),
//       DISPATCH_INTERVAL: Number(form.dispatchInterval),
//       ALTERNATING_QUEUE: form.alternatingQueue,
//       GROUP_SIZES: RIDES.GOTG.GROUP_SIZES || {}, // For simplicity, using GOTG's group sizes
//     };

//     console.log("Saving ride:", rideKey, rideData);

//     saveRideToLocalStorage(rideKey, rideData);
//     setCustomRides((prev) => ({ ...prev, [rideKey]: rideData }));

//     // Reset form
//     setForm({
//       name: GOTG.NAME,
//       cars: GOTG.CARS,
//       rowsPerCar: GOTG.ROWS_PER_CAR,
//       seatsPerRow: GOTG.SEATS_PER_ROW,
//       dispatchInterval: GOTG.DISPATCH_INTERVAL,
//       queueSize: GOTG.QUEUE_SIZE,
//       holdingQueues: GOTG.NUMBER_OF_HOLDINGEQUEUES,
//       alternatingQueue: GOTG.ALTERNATING_QUEUE,
//     });

//     if (setRide) setRide(rideKey);
//     if (onClose) onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div>
//       <h6>Create Custom Ride</h6>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
//         <Form.Group>
//           <Form.Label>Name</Form.Label>
//           <Form.Control
//             value={form.name}
//             onChange={(e) => handleChange("name", e.target.value)}
//           />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Cars</Form.Label>
//           <Form.Control
//             type="number"
//             min={1}
//             max={10}
//             value={form.cars}
//             onChange={(e) => handleChange("cars", Number(e.target.value))}
//           />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Rows per Car</Form.Label>
//           <Form.Control
//             type="number"
//             min={1}
//             max={10}
//             value={form.rowsPerCar}
//             onChange={(e) => handleChange("rowsPerCar", Number(e.target.value))}
//           />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Seats per Row</Form.Label>
//           <Form.Control
//             type="number"
//             min={1}
//             max={10}
//             value={form.seatsPerRow}
//             onChange={(e) => handleChange("seatsPerRow", Number(e.target.value))}
//           />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Queue Size</Form.Label>
//           <Form.Control
//             type="number"
//             min={1}
//             max={20}
//             value={form.queueSize}
//             onChange={(e) => handleChange("queueSize", Number(e.target.value))}
//           />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Holding Queues</Form.Label>
//           <Form.Control
//             type="number"
//             min={1}
//             max={5}
//             value={form.holdingQueues}
//             onChange={(e) => handleChange("holdingQueues", Number(e.target.value))}
//           />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Dispatch Interval (sec)</Form.Label>
//           <Form.Control
//             type="number"
//             min={5}
//             max={60}
//             value={form.dispatchInterval}
//             onChange={(e) => handleChange("dispatchInterval", Number(e.target.value))}
//           />
//         </Form.Group>

//         <Form.Group style={{ display: "flex", alignItems: "center" }}>
//           <Form.Check
//             type="switch"
//             label="Alternating Queue"
//             checked={form.alternatingQueue}
//             onChange={(e) => handleChange("alternatingQueue", e.target.checked)}
//           />
//         </Form.Group>
//       </div>

//       <Button className="mt-2 w-100" size="sm" onClick={handleSave}>
//         Save Custom Ride
//       </Button>
//     </div>
//   );
// };
