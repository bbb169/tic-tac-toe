export type CellType = 'O'|'X'|''
export interface Cell {
    index: number;
    successed?: boolean; // means it's the cell in game over path
    type: CellType; // means O or X
}

export interface PlayersPath {
    No1: number[];
    No2: number[];
}

export enum Directions {
    top  = 'top',
    right  = 'right',
    bottom = 'bottom',
    left  = 'left',
}

export enum ReverseDirections {
    top = 'bottom',
    right = 'left',
    bottom = 'top',
    left = 'right',
}

export type Players = 'No1' | 'No2'

