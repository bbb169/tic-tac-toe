export interface Cell {
    index: number
    O?: boolean //means O or X
    right?: Cell
    left?: Cell
    top?: Cell
    bottom?: Cell
}

export enum Directions {
    T = 'top',
    R = 'right',
    B = 'bottom',
    L = 'left',
}