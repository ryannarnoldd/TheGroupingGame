# The Ride Grouping Game

This project is a web-based tool to help efficiently group guests into ride vehicles for *Guardians of the Galaxy: Cosmic Rewind*.

## Features

- Groups guests into trains with 5 cars per train.
- Each car has 2 rows with 2 seats per row.
- Optimizes guest assignments for smoother ride operations.
- Interactive interface for managing guest lists and assignments.

## Technologies

- **Frontend:** React + TypeScript
- **State Management:** React hooks
- **Styling:** CSS / Tailwind (if applicable)
- **Data Handling:** Local state (can be extended to use backend APIs)

## Usage

1. Add guests to the list.
2. Click **Group Guests**.
3. Guests are assigned to cars and rows automatically.
4. Review and adjust assignments if necessary.

## Folder Structure

src/
├─ components/ # React components
├─ hooks/ # Custom hooks
├─ utils/ # Helper functions
└─ App.tsx # Main app component

markdown
Copy
Edit

## Future Improvements

- Persist data using a backend or database.
- Add constraints for specific guest groupings.
- Visualize train and car layouts with drag-and-drop.

## License

MIT License