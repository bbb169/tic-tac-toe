import { Cell, Directions } from './types';

function getNearCellByDirectionByCellsBySize (cells:Cell[], index:number, row: number, columns: number, direction: Directions) {
    if ((index + 1) % row !== 1 && direction === Directions.left) {
        return cells[index - 1];
    }

    if ((index + 1) % row !== 0 && direction === Directions.right) {
        return cells[index + 1];
    }

    if ((index + 1) / columns > 1 && direction === Directions.top) {
        return cells[index - row];
    }

    if (index + 1 <= row * (columns - 1) && direction === Directions.bottom) {
        return cells[index + row];
    }
}

export const getNearCellByDirectionByCells = (cells: Cell[], index: number, direction: Directions) => {
    return getNearCellByDirectionByCellsBySize(cells, index, 3, 3, direction);
};
