export type Group = {
    id: number;
    size: number;
    color: string;
    request?: "Front" | "Back" | "Row 1" | "Row 9" | "Odd" | "Even" | "Alone" | "Together";
}

export type Seat = {
  id: number;
  row: number;
  takenBy?: number;
  isSelected?: boolean;
};

export type Queues = {
    A: Group[];
    B: Group[];
    C: Group[];
};