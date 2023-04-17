import React from 'react';
import { Button } from 'antd';
import { Cell, CellType, Players, PlayersPath } from '../libs/types';
import { getReversePlayer } from '../libs/public';

export function GoBackButton ({
    cells,
    currentPlayer,
    playersPath,
    getButtonsDom,
    setCells,
    setPlayerPath,
    setCurrentPlayer,
    updateCellButtonsDom,
}: {
    cells: Cell[];
    currentPlayer: Players;
    playersPath: PlayersPath;
    getButtonsDom(): JSX.Element[];
    setCells: React.Dispatch<{
        index: number;
        type?: CellType | undefined;
        successed?: boolean | undefined;
    }>;
    setPlayerPath: React.Dispatch<{
        player: 'No1' | 'No2';
        cellIndex?: number | undefined;
    }>;
    setCurrentPlayer: React.Dispatch<'No1' | 'No2'>;
    updateCellButtonsDom: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}) {
    const goBack = React.useCallback(() => {
        cells.forEach((cell) => (cell.successed = false));
        const reversePlayer = getReversePlayer(currentPlayer);
        setCurrentPlayer(reversePlayer);

        // clear pre player's last one path
        const player = playersPath[reversePlayer];

        if (!player.length) return;
        setCells({ index: player[player.length - 1], type: '' });
        setPlayerPath({ player: reversePlayer });
        updateCellButtonsDom(getButtonsDom());
    }, [currentPlayer]);

    return (
        <Button type="primary" onClick={goBack}>
      Go Back
        </Button>
    );
}
