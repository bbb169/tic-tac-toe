import React from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell, PlayersPath } from './libs/types';
import { Button, message } from 'antd';
import { cellButtonStyle, cellsBoxStyle } from './libs/style';
import { getGameInfo } from './libs/public';

const playersPath: PlayersPath = { No1: [], No2: [] }; // No1 means first player in the game, so is No2.
const cells: Cell[] = Array.from(
    { length: 9 },
    (cell, index) => (cell = { index })
);
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

function onCellClick (
    cells: Cell[],
    cell: Cell,
    setCellButtonsDom: () => void,
    messageOpen: () => void
) {
    if (
        cell.isO !== undefined ||
    getGameInfo(cells, currentPlayer, playersPath).gameOver
    ) return;

    cell.isO = currentPlayer === 'No1';
    playersPath[currentPlayer].push(cell.index);

    const game = getGameInfo(cells, currentPlayer, playersPath); // check whether is game over every time

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
