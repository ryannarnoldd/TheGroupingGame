export const RIDES = {
    "GOTG": {
        "ALTERNATING_QUEUE": true,
        "CARS": 5,
        "ROWS_PER_CAR": 2,
        "SEATS_PER_ROW": 2,
        "QUEUE_SIZE": 5,
        "GROUP_SIZES": {
            1: ["Row 9", "Seated alone", "Odd row", "Even row", "Alone row"],
            2: ["Row 9", "Odd row", "Even row"],
            3: ["Same car", "Alone row"],
            4: [],
            5: ["2 and 3"],
            6: [],
            7: ["4 and 3"],
            8: [],
            9: [],
            10: [],
        },
        "NUMBER_OF_HOLDINGEQUEUES": 3,
        "DISPATCH_INTERVAL": 36
    },
    "SM": {
        "ALTERNATING_QUEUE": true,
        "CARS": 2,
        "ROWS_PER_CAR": 3,
        "SEATS_PER_ROW": 1,
        "QUEUE_SIZE": 6,
        "GROUP_SIZES": {
            1: ["Row 9", "Seated alone", "Odd row", "Even row", "Alone row"],
            2: ["Row 9", "Odd row", "Even row"],
            3: ["Same car", "Alone row"],
            4: ["Same car"],
            5: ["2 and 3"],
            6: ["3 and 3"],
            7: ["4 and 3"],
            8: [],
            9: [],
            10: [],
        },
        "NUMBER_OF_HOLDINGEQUEUES": 3,
        "DISPATCH_INTERVAL": 36
    },
    "TRON": {
        "ALTERNATING_QUEUE": true,
        "CARS": 7,
        "ROWS_PER_CAR": 1,
        "SEATS_PER_ROW": 2,
        "QUEUE_SIZE": 6,
        "GROUP_SIZES": {
            1: ["Row 9", "Seated alone", "Odd row", "Even row", "Alone row"],
            2: ["Row 9", "Odd row", "Even row"],
            3: ["Same car", "Alone row"],
            4: [],
            5: ["2 and 3"],
            6: ["3 and 3"],
            7: ["4 and 3"],
            8: [],
            9: [],
            10: [],
        },
        "NUMBER_OF_HOLDINGEQUEUES": 3,
        "DISPATCH_INTERVAL": 36
    },
    "SPIDER": {
        "ALTERNATING_QUEUE": true,
        "QUEUE_TYPE": "All",
        "CARS": 2,
        "ROWS_PER_CAR": 3,
        "SEATS_PER_ROW": 4,
        "QUEUE_SIZE": 4,
        "GROUP_SIZES": {
            1: ["Row 9", "Seated alone", "Odd row", "Even row", "Alone row"],
            2: ["Row 9", "Odd row", "Even row"],
            3: ["Same car", "Alone row"],
            4: ["Same car"],
            5: ["2 and 3"],
            6: ["3 and 3"],
            7: ["4 and 3"],
            8: [],
            9: [],
            10: [],
        },
        "NUMBER_OF_HOLDINGEQUEUES": 3,
        "DISPATCH_INTERVAL": 36
    }
}

export const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FF69B4"]; // Example colors