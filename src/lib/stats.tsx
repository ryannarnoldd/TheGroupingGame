import { loadStatsFromLocalStorage } from './localStorage'
import { ShiftStats, StoredShiftState } from '../types/types'

export const loadStats = () => {
    return loadStatsFromLocalStorage() || {
        totalShifts: 0,
        highestShift: { emptySeats: 0, totalTrains: 0, seatsPerTrain: 0 },
        mostAccurateShift: { emptySeats: 0, totalTrains: 0, seatsPerTrain: 0 },
    } as ShiftStats
}

export const getShiftAccuracy = (storedShiftState: StoredShiftState) => {
    const { emptySeats, totalTrains, seatsPerTrain } = storedShiftState
    const totalNumOfSeats = totalTrains * seatsPerTrain

    if (totalTrains === 0) return 0;

    return Math.round(((totalNumOfSeats - emptySeats) / totalNumOfSeats) * 100);
}

export const getScore = (storedShiftState: StoredShiftState) => {
    const { seatsPerTrain, totalTrains, emptySeats } = storedShiftState
    return (totalTrains * seatsPerTrain) - emptySeats
}

export const getHighScore = (stats: ShiftStats) => {
    return stats.highestShift || 0;
}

export const getHighestAccuracy = (stats: ShiftStats) => {
    return stats.mostAccurateShift || 0;
}

export const getStatsForCompletedGame = (currentShift: StoredShiftState) => {
    const stats = loadStats()
    stats.totalShifts += 1

    const currentShiftScore = getScore(currentShift)
    const highestScore = getScore(stats.highestShift)

    const currentShiftAccuracy = getShiftAccuracy(currentShift)
    const mostAccurateShiftAccuracy = getShiftAccuracy(stats.mostAccurateShift)

    if (currentShiftScore > highestScore || (currentShiftScore === highestScore && currentShift.emptySeats < stats.highestShift.emptySeats)) {
        stats.highestShift = currentShift;
    }

    if (currentShiftAccuracy >= mostAccurateShiftAccuracy) {
        stats.mostAccurateShift = currentShift;
    }

    return stats
}

export const formatShift = (shift: StoredShiftState) => {
    const { totalTrains, seatsPerTrain } = shift
    const totalNumOfSeats = totalTrains * seatsPerTrain

    return `${getScore(shift)}/${totalNumOfSeats} (${getShiftAccuracy(shift)}%)`;
}
