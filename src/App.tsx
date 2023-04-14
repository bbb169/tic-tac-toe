import React from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell, Directions, ReverseDirections } from './libs/types';
import { Button, message } from 'antd';
import { cellButtonStyle, cellsBoxStyle } from './libs/style';
import { getNearCellByDirectionByCells } from './libs/public';

const playersPath: { No1: number[], No2: number[] } = { No1: [], No2: [] }; // No1 means first player in the game, so is No2.
const cells: Cell[] = Array.from(
    { length: 9 },
    (cell, index) => (cell = { index })
);
const getNearCellByDirection = (index: number, direction: Directions) => {
    return getNearCellByDirectionByCells(cells, index, direction);
};
let currentPlayer: 'No1' | 'No2' = 'No1';

function App () {
    const [cellButtonsDom, setCellButtonsDom] = React.useState(initButtons());
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <>
            {contextHolder}
            <div style={cellsBoxStyle}>{cellButtonsDom}</div>
            <Button
                type="primary"
                onClick={() => {
                    goBack(cells, () => {
                        setCellButtonsDom(initButtons());
                    });
                }}
            >
        Go Back
            </Button>
        </>
    );

    function initButtons () {
        return cells.map((cell, index) => {
            return (
                <CellButton
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    state={cell.isO}
                    successd={cell.successed}
                    style={cellButtonStyle}
                    onCellClick={() => {
                        onCellClick(
                            cells,
                            cells[index],
                            () => {
                                setCellButtonsDom(initButtons());
                            },
                            () => {
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                messageApi.open({
                                    type: 'success',
                                    content: 'Game Over!',
                                });
                            }
                        );
                    }}
                />
            );
        });
    }
}

function resolveDirection (
    cellIndex: number,
    directions: Directions[],
    reverse?: boolean
) {
    // Gives the next cell in the corresponding direction
    let innerDirections = directions;
    if (reverse) innerDirections = directions.map((direction) => toReverse(direction));
    return innerDirections[1]
        ? (getNearCellByDirection(
            (getNearCellByDirection(cellIndex, innerDirections[0]) as Cell)?.index,
            innerDirections[1]
        ) as Cell) // get diagonal cell which needs two direction to sure.
        : (getNearCellByDirection(cellIndex, innerDirections[0]) as Cell);

    function toReverse (direction: Directions) {
        const rdirection = ReverseDirections[direction];
        return rdirection as unknown as Directions;
    }
}

function getGameInfo (cells: Cell[], currentPlayer: 'No1' | 'No2') {
    const playerPath = playersPath[currentPlayer];
    let passed: number[] = [];
    return {
        gameOver: consecutiveTimes(cells, cells[playerPath[playerPath.length - 1]]),
        path: passed,
    };

    function consecutiveTimes (
        cells: Cell[],
        checkCell: Cell,
        directions?: Directions[]
    ) {
        let enough = false;

        playerPath.forEach((cellIndex) => {
            // check whether path is consecutive
            if (cellIndex === checkCell.index) return; // don't check itself
            if (directions) return findByDirection(directions, cellIndex); // finding way is only need focus one direction

            // finding by eight directions
            findByDirection([Directions.left], cellIndex);
            findByDirection([Directions.left, Directions.top], cellIndex);
            findByDirection([Directions.left, Directions.bottom], cellIndex);
            findByDirection([Directions.top], cellIndex);
            findByDirection([Directions.top, Directions.right], cellIndex);
            findByDirection([Directions.right], cellIndex);
            findByDirection([Directions.right, Directions.bottom], cellIndex);
            findByDirection([Directions.bottom], cellIndex);
        });

        return enough;

        function findByDirection (directions: Directions[], cellIndex: number) {
            if (enough) return;

            passed = [];
            if (resolveDirection(checkCell.index, directions) === cells[cellIndex]) {
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
                const nextCell = resolveDirection(checkCell.index, directions, reverse);
                if (!nextCell) return 0;

                let times = 0;

                if (playerPath.includes(nextCell.index)) {
                    passed.push(nextCell.index);
                    times += oneDirectionTimes(nextCell, directions, reverse) + 1; // find next in this direction.
                }
                return times;
            }
        }
    }
}

function onCellClick (
    cells: Cell[],
    cell: Cell,
    setCellButtonsDom: () => void,
    messageOpen: () => void
) {
    if (cell.isO !== undefined || getGameInfo(cells, currentPlayer).gameOver) return;

    cell.isO = currentPlayer === 'No1';
    playersPath[currentPlayer].push(cell.index);

    const game = getGameInfo(cells, currentPlayer); // check whether is game over every time

    if (game.gameOver) {
        messageOpen();
        game.path.forEach((cellIndex) => {
            cells[cellIndex].successed = true;
        });
    }
    currentPlayer = currentPlayer === 'No1' ? 'No2' : 'No1';
    setCellButtonsDom();
}

function goBack (cells: Cell[], setCellButtonsDom: () => void) {
    cells.forEach((cell) => (cell.successed = false));
    currentPlayer = currentPlayer === 'No1' ? 'No2' : 'No1';

    // clear current player's last one path
    const player = playersPath[currentPlayer];
    if (!player.length) return;
    cells[player[player.length - 1]].isO = undefined;
    player.splice(player.length - 1, 1);
    setCellButtonsDom();
}

export default App;
