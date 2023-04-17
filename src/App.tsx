/* eslint-disable no-console */
import React, { useEffect } from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell, CellType, Players, PlayersPath } from './libs/types';
import { Button, message } from 'antd';
import { cellButtonStyle, cellsBoxStyle } from './libs/style';
import { getGameInfo } from './libs/public';

function App () {
    const [cells, setCells] = React.useReducer(
        cellsReducer,
        Array.from(
            { length: 9 },
            (cell, index) => (cell = { index, type: '' } as Cell)
        )
    );
    // eslint-disable-next-line new-cap
    const [currentPlayer, setCurrentPlayer] = React.useReducer(
        currentPlayerReducer,
        'No1'
    );
    const [playersPath, setPlayerPath] = React.useReducer(playersPathReducer, {
        No1: [],
        No2: [],
    }); // No1 means first player in the game, so is No2.
    const [cellButtonsDom, updateCellButtonsDom] = React.useState(getButtonsDom());
    const [messageApi, contextHolder] = message.useMessage();
    const onCellClick = React.useCallback(
        (cells: Cell[], cell: Cell) => {
            // eslint-disable-next-line no-console
            console.log(cell.type);
            if (
                cell.type !== '' ||
        getGameInfo(cells, currentPlayer, playersPath).gameOver
            ) return;
            setCells({
                index: cell.index,
                type: currentPlayer === 'No1' ? 'O' : 'X',
            });
            setPlayerPath({ player: currentPlayer, cellIndex: cell.index });
            setCurrentPlayer(currentPlayer === 'No1' ? 'No2' : 'No1');
            console.log(currentPlayer);
        },
        [currentPlayer]
    );
    const goBack = React.useCallback(
        (cells: Cell[], updateCellButtonsDom: () => void) => {
            cells.forEach((cell) => (cell.successed = false));
            const reversePlayer = currentPlayer === 'No1' ? 'No2' : 'No1';
            setCurrentPlayer(reversePlayer);

            // clear pre player's last one path
            const player = playersPath[reversePlayer];
            console.log(player);

            if (!player.length) return;
            setCells({ index: player[player.length - 1], type: '' });
            setPlayerPath({ player: reversePlayer });
            updateCellButtonsDom();
        },
        [currentPlayer]
    );

    useEffect(() => {
        const prePlayer = currentPlayer === 'No1' ? 'No2' : 'No1';
        const game = getGameInfo(cells, prePlayer, playersPath); // check whether is game over every time

        if (game.gameOver) gameOverActions();

        updateCellButtonsDom(getButtonsDom());

        function gameOverActions () {
            messageApi.open({
                type: 'success',
                content: 'Game Over!',
            });
            game.path.forEach((cellIndex) => {
                cells[cellIndex].successed = true;
            });
        }
    }, [currentPlayer]);

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
        console.log(cells);

        return cells.map((cell, index) => {
            return (
                <CellButton
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    state={cell.type}
                    successd={cell.successed}
                    style={cellButtonStyle}
                    onCellClick={() => {
                        onCellClick(cells, cells[index]);
                    }}
                />
            );
        });
    }
}

function cellsReducer (
    state: Cell[],
    action: { index: number, type?: CellType, successed?: boolean }
) {
    const cell = state[action.index];
    if (action.type !== undefined) cell.type = action.type;
    if (action.successed) cell.successed = action.successed;
    return state;
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
    console.log(state);

    return state;
}

function currentPlayerReducer (state: Players, action: 'No1' | 'No2'): Players {
    return action;
}

export default App;
