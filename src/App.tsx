import React, { useEffect } from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell } from './libs/types';
import { Button, message } from 'antd';
import { cellButtonStyle, cellsBoxStyle } from './libs/style';
import { getGameInfo } from './libs/public';
import {
    cellsReducer,
    currentPlayerReducer,
    playersPathReducer,
} from './libs/reducers';

function App () {
    const [cells, setCells] = React.useReducer(
        cellsReducer,
        Array.from(
            { length: 9 },
            (cell, index) => (cell = { index, type: '' } as Cell)
        )
    );
    const [currentPlayer, setCurrentPlayer] = React.useReducer(
        currentPlayerReducer,
        'No1'
    );
    const [playersPath, setPlayerPath] = React.useReducer(playersPathReducer, {
        No1: [],
        No2: [],
    }); // No1 means first player in the game, so is No2.
    const [cellButtonsDom, updateCellButtonsDom] = React.useState(getButtonsDom());
    const [gameOverMessage, gameOverMessageHolder] = message.useMessage();
    const onCellClick = React.useCallback(
        (cells: Cell[], cell: Cell) => {
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
            gameOverMessage.open({
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
            {gameOverMessageHolder}
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

export default App;
