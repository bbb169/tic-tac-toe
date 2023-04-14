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
    const [cellButtonsDom, updateCellButtonsDom] = React.useState(getButtonsDom());
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <>
            {contextHolder}
            <div style={cellsBoxStyle}>{cellButtonsDom}</div>
            <Button
                type="primary"
                onClick={() => {
                    goBack(cells, () => {
                        updateCellButtonsDom(getButtonsDom());
                    });
                }}
            >
        Go Back
            </Button>
        </>
    );

    function getButtonsDom () {
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
                                updateCellButtonsDom(getButtonsDom());
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
    updateCellButtonsDom: () => void,
    messageOpen: () => void
) {
    if (
        cell.isO !== undefined ||
    getGameInfo(cells, currentPlayer, playersPath).gameOver
    ) return;

    cell.isO = currentPlayer === 'No1';
    playersPath[currentPlayer].push(cell.index);

    const game = getGameInfo(cells, currentPlayer, playersPath); // check whether is game over every time

    if (game.gameOver) gameOverActions();

    currentPlayer = currentPlayer === 'No1' ? 'No2' : 'No1';
    updateCellButtonsDom();

    function gameOverActions () {
        messageOpen();
        game.path.forEach((cellIndex) => {
            cells[cellIndex].successed = true;
        });
    }
}

function goBack (cells: Cell[], updateCellButtonsDom: () => void) {
    cells.forEach((cell) => (cell.successed = false));
    currentPlayer = currentPlayer === 'No1' ? 'No2' : 'No1';

    // clear current player's last one path
    const player = playersPath[currentPlayer];
    if (!player.length) return;
    cells[player[player.length - 1]].isO = undefined;
    player.splice(player.length - 1, 1);
    updateCellButtonsDom();
}

export default App;
