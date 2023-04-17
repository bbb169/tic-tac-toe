import React, { useEffect, useMemo } from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell } from './libs/types';
import { message } from 'antd';
import { cellButtonStyle, cellsBoxStyle } from './libs/style';
import { getGameInfo, getReversePlayer } from './libs/public';
import {
    cellsReducer,
    currentPlayerReducer,
    playersPathReducer,
} from './libs/reducers';
import { GoBackButton } from './component/go-back-button';

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
    const gameInfo = useMemo(
        () => getGameInfo(cells, getReversePlayer(currentPlayer), playersPath),
        [cells, currentPlayer, playersPath]
    );
    const [cellButtonsDom, updateCellButtonsDom] = React.useState(getButtonsDom());
    const [gameOverMessage, gameOverMessageHolder] = message.useMessage();

    useEffect(() => {
        if (gameInfo.gameOver) gameOverActions();

        updateCellButtonsDom(getButtonsDom());

        function gameOverActions () {
            gameOverMessage.open({
                type: 'success',
                content: 'Game Over!',
            });
            gameInfo.path.forEach((cellIndex) => {
                cells[cellIndex].successed = true; // give the passed cells of game over
            });
        }
    }, [currentPlayer]);

    return (
        <>
            {gameOverMessageHolder}
            <div style={cellsBoxStyle}>{cellButtonsDom}</div>
            <GoBackButton
                cells={cells}
                currentPlayer={currentPlayer}
                playersPath={playersPath}
                getButtonsDom={getButtonsDom}
                setCells={setCells}
                setPlayerPath={setPlayerPath}
                setCurrentPlayer={setCurrentPlayer}
                updateCellButtonsDom={updateCellButtonsDom}
            />
        </>
    );

    function getButtonsDom () {
        return cells.map((cell, index) => {
            return (
                <CellButton
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    cell={cell}
                    style={cellButtonStyle}
                    gameInfo={gameInfo}
                    currentPlayer={currentPlayer}
                    setCells={setCells}
                    setCurrentPlayer={setCurrentPlayer}
                    setPlayerPath={setPlayerPath}
                />
            );
        });
    }
}

export default App;
