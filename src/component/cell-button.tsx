import React from 'react';
import { Button } from 'antd';
import { MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { CellType } from '../libs/types';

export function CellButton ({
    successd,
    state,
    style,
    onCellClick,
}: {
    successd?: boolean;
    state: CellType;
    style: React.CSSProperties;
    onCellClick: () => void;
}) {
    return (
        <Button
            icon={useIconByState(state)}
            danger={state === 'O'}
            type={state === 'X' ? 'primary' : 'default'}
            shape={successd ?? false ? 'circle' : 'default'}
            style={style}
            onClick={onCellClick}
        />
    );
}

function useIconByState (state: CellType) {
    if (!state) {
        return '';
    }
    if (state === 'O') {
        return <MinusCircleOutlined />;
    }
    return <CloseOutlined />;
}
