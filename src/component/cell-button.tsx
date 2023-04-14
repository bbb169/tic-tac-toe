import React from 'react';
import { Button } from 'antd';
import { MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';

export function CellButton ({
    successd,
    state,
    style,
    onCellClick,
}: {
    successd?: boolean;
    state?: boolean;
    style: React.CSSProperties;
    onCellClick: () => void;
}) {
    return (
        <Button
            icon={useIconByState(state)}
            danger={state as boolean}
            type={state === false ? 'primary' : 'default'}
            shape={successd ?? false ? 'circle' : 'default'}
            style={style}
            onClick={onCellClick}
        />
    );
}

function useIconByState (state: boolean | undefined) {
    if (state === undefined) {
        return '';
    }
    if (state) {
        return <MinusCircleOutlined />;
    }
    return <CloseOutlined />;
}
