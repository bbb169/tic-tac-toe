import React from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell, Players, PlayersPath } from './libs/types';
import { Button, message } from 'antd';
import { cellButtonStyle, cellsBoxStyle } from './libs/style';
import { getGameInfo } from './libs/public';

const cells: Cell[] = Array.from(
    { length: 9 },
    (cell, index) => (cell = { index })
);

function App () {
    // eslint-disable-next-line new-cap
    const currentPlayer = React.useRef<Players>('No1');
    const [playersPath, setPlayerPath] = React.useReducer(playersPathReducer, {
        No1: [],
        No2: [],
    }); // No1 means first player in the game, so is No2.
    const [cellButtonsDom, updateCellButtonsDom] = React.useState(getButtonsDom());
    const [messageApi, contextHolder] = message.useMessage();
    const onCellClick = React.useCallback(
        (
            cells: Cell[],
            cell: Cell,
            updateCellButtonsDom: () => void,
            messageOpen: () => void
        ) => {
            if (
                cell.isO !== undefined ||
        getGameInfo(cells, currentPlayer.current, playersPath).gameOver
            ) return;

            cell.isO = currentPlayer.current === 'No1';
            setPlayerPath({ player: currentPlayer.current, cellIndex: cell.index });

            const game = getGameInfo(cells, currentPlayer.current, playersPath); // check whether is game over every time

            if (game.gameOver) gameOverActions();

            currentPlayer.current = (currentPlayer.current === 'No1' ? 'No2' : 'No1');
            updateCellButtonsDom();

            function gameOverActions () {
                messageOpen();
                game.path.forEach((cellIndex) => {
                    cells[cellIndex].successed = true;
                });
            }
        },
        [currentPlayer.current, playersPath]
    );
    const goBack = React.useCallback(
        (cells: Cell[], updateCellButtonsDom: () => void) => {
            cells.forEach((cell) => (cell.successed = false));
            currentPlayer.current = (currentPlayer.current === 'No1' ? 'No2' : 'No1');

            // clear current player's last one path
            const player = playersPath[currentPlayer.current];
            if (!player.length) return;
            cells[player[player.length - 1]].isO = undefined;
            setPlayerPath({ player: currentPlayer.current });
            updateCellButtonsDom();
        },
        [currentPlayer.current, playersPath]
    );

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

function playersPathReducer (
    state: PlayersPath,
    action: { player: 'No1' | 'No2', cellIndex?: number }
): PlayersPath {
    const player = state[action.player];
    if (action.cellIndex !== undefined) {
        player.push(action.cellIndex as number);
    } else {
        player.splice(player.length - 1, 1);
    }
    return state;
}

export default App;
