import { Cell, CellType, Players, PlayersPath } from './types';

export function cellsReducer (
    state: Cell[],
    action: { index: number, type?: CellType, successed?: boolean }
) {
    const cell = state[action.index];
    if (action.type !== undefined) cell.type = action.type;
    if (action.successed) cell.successed = action.successed;
    return state;
}

export function playersPathReducer (
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

export function currentPlayerReducer (state: Players, action: 'No1' | 'No2'): Players {
    return action;
}
