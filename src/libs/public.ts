import { Cell, Directions, PlayersPath, ReverseDirections } from './types';

function getNearCellByDirectionByCellsBySize (cells:Cell[], index:number, row: number, columns: number, direction: Directions) { // just give four directions
    if ((index + 1) % row !== 1 && direction === Directions.left) return cells[index - 1];

    if ((index + 1) % row !== 0 && direction === Directions.right) return cells[index + 1];

    if ((index + 1) / columns > 1 && direction === Directions.top) return cells[index - row];

    if (index + 1 <= row * (columns - 1) && direction === Directions.bottom) return cells[index + row];
}

const getNearCellByDirectionByCells = (cells: Cell[], index: number, direction: Directions) => {
    return getNearCellByDirectionByCellsBySize(cells, index, 3, 3, direction);
};

function getCellInAllDirectionByCells (
    cells: Cell[],
    cellIndex: number,
    directions: Directions[],
    reverse?: boolean
) {
    // Gives the next cell in the eight directions
    let innerDirections = directions;
    if (reverse) innerDirections = directions.map((direction) => toReverse(direction));
    return innerDirections[1]
        ? (getNearCellByDirectionByCells(
            cells,
            (getNearCellByDirectionByCells(cells, cellIndex, innerDirections[0]) as Cell)?.index,
            innerDirections[1]
        ) as Cell) // get diagonal cell which needs two direction to sure.
        : (getNearCellByDirectionByCells(cells, cellIndex, innerDirections[0]) as Cell);

    function toReverse (direction: Directions) { // reverse the direction if needed
        const rdirection = ReverseDirections[direction];
        return rdirection as unknown as Directions;
    }
}


export function getGameInfo (cells: Cell[], currentPlayer: 'No1' | 'No2', playersPath: PlayersPath) {
    const playerPath = playersPath[currentPlayer];
    let passed: number[] = [];
    return {
        gameOver: isConsecutiveTimesEnough(cells, cells[playerPath[playerPath.length - 1]]),
        path: passed,
    };

    function isConsecutiveTimesEnough (
        cells: Cell[],
        checkCell: Cell,
        directions?: Directions[]
    ) { // Determine if the pieces form three in a row
        let enough = false;

        playerPath.forEach((cellIndex) => {
            // check whether path is consecutive

            if (cellIndex === checkCell.index) return; // don't check itself
            if (directions) return findByOneDirection(directions, cellIndex); // finding way is only need focus one direction

            // finding by eight directions
            findByOneDirection([Directions.left], cellIndex);
            findByOneDirection([Directions.left, Directions.top], cellIndex);
            findByOneDirection([Directions.left, Directions.bottom], cellIndex);
            findByOneDirection([Directions.top], cellIndex);
            findByOneDirection([Directions.top, Directions.right], cellIndex);
            findByOneDirection([Directions.right], cellIndex);
            findByOneDirection([Directions.right, Directions.bottom], cellIndex);
            findByOneDirection([Directions.bottom], cellIndex);
        });

        return enough;

        function findByOneDirection (directions: Directions[], cellIndex: number) {
            if (enough) return;

            passed = [];
            if (
                getCellInAllDirectionByCells(cells, checkCell.index, directions) === cells[cellIndex]
            ) {
                passed.push(checkCell.index);
                const totalTimes =
          oneDirectionTimes(checkCell, directions) +
          oneDirectionTimes(checkCell, directions, true); // search in two directions
                if (totalTimes >= 2) return (enough = true);
            }

            function oneDirectionTimes (
                checkCell: Cell,
                directions: Directions[],
                reverse?: boolean
            ) {
                const nextCell = getCellInAllDirectionByCells(
                    cells,
                    checkCell.index,
                    directions,
                    reverse
                );
                if (!nextCell) return 0;

                let times = 0;

                if (playerPath.includes(nextCell.index)) { // means path is consecutive
                    passed.push(nextCell.index);
                    times += oneDirectionTimes(nextCell, directions, reverse) + 1; // find next in this direction.
                }
                return times;
            }
        }
    }
}
