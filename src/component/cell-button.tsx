import React from 'react';
import { Button } from 'antd';
import { MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Cell, CellType, Players } from '../libs/types';
import { getReversePlayer } from '../libs/public';

export function CellButton ({
    cell,
    style,
    gameInfo,
    currentPlayer,
    setCells,
    setPlayerPath,
    setCurrentPlayer,
}: {
    cell: Cell;
    style: React.CSSProperties;
    gameInfo: {
        gameOver: boolean;
        path: number[];
    };
    currentPlayer: Players;
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
}) {
    const onCellClick = React.useCallback(() => {
        if (cell.type !== '' || gameInfo.gameOver) return; // if game over or cell had type 'O' or 'X', do nothing

        setCells({
            index: cell.index,
            type: currentPlayer === 'No1' ? 'O' : 'X',
        });
        setPlayerPath({ player: currentPlayer, cellIndex: cell.index });
        setCurrentPlayer(getReversePlayer(currentPlayer));
    }, [currentPlayer]);

    return (
        <Button
            icon={useIconByType(cell.type)}
            danger={cell.type === 'O'}
            type={cell.type === 'X' ? 'primary' : 'default'}
            shape={cell.successed ?? false ? 'circle' : 'default'}
            style={style}
            onClick={onCellClick}
        />
    );
}

function useIconByType (type: CellType) {
    if (!type) {
        return '';
    }
    if (type === 'O') {
        return <MinusCircleOutlined />;
    }
    return <CloseOutlined />;
}
