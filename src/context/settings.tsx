// Make a function that returns GROUP_SIZES, but only allows the size of the seats per row
// to make requests for rows, as long as the train. this is temporary but it will
// make it very easy to handle row request temproarily. do you know what i mean?

const createGroupSizings = (
  seatsPerRow: number,
  totalRows: number,
  maxGroupSize: number,
) => {
  const groupSizes: { [size: number]: number[] } = {};

  for (let size = 1; size <= maxGroupSize; size++) {
    // Only add row requests if the group can fit within a row
    if (size <= seatsPerRow) {
      groupSizes[size] = [];
      for (let row = 1; row <= totalRows; row++) {
        groupSizes[size].push(row);
      }
    } else {
      // Groups larger than a row have no specific row request
      groupSizes[size] = [];
    }
  }

  return groupSizes;
};

export const RIDES = {
  GOTG: {
    ALTERNATING_QUEUE: true,
    CARS: 5,
    ROWS_PER_CAR: 2,
    SEATS_PER_ROW: 2,
    QUEUE_SIZE: 6,
    GROUP_SIZES: createGroupSizings(2, 10, 10), // 2 seats per row, 10 total rows, max group size 10
    NUMBER_OF_HOLDINGEQUEUES: 3,
    DISPATCH_INTERVAL: 36,
  },
  SM: {
    ALTERNATING_QUEUE: false,
    CARS: 2,
    ROWS_PER_CAR: 3,
    SEATS_PER_ROW: 1,
    QUEUE_SIZE: 4,
    GROUP_SIZES: createGroupSizings(1, 6, 6), // 1 seat per row, 6 total rows, max group size 1
    NUMBER_OF_HOLDINGEQUEUES: 1,
    DISPATCH_INTERVAL: 19,
  },
  TRON: {
    ALTERNATING_QUEUE: true,
    CARS: 7,
    ROWS_PER_CAR: 1,
    SEATS_PER_ROW: 2,
    QUEUE_SIZE: 6,
    GROUP_SIZES: createGroupSizings(2, 7, 7), // 2 seats per row, 7 total rows, max group size 5
    NUMBER_OF_HOLDINGEQUEUES: 3,
    DISPATCH_INTERVAL: 25,
  },
  SPIDER: {
    ALTERNATING_QUEUE: true,
    QUEUE_TYPE: "All",
    CARS: 2,
    ROWS_PER_CAR: 3,
    SEATS_PER_ROW: 4,
    QUEUE_SIZE: 4,
    GROUP_SIZES: createGroupSizings(4, 6, 4), // 4 seats per row, 6 total rows, max group size 4
    NUMBER_OF_HOLDINGEQUEUES: 3,
    DISPATCH_INTERVAL: 36,
  },
};

export const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FF69B4"]; // Example colors
