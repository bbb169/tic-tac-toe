export interface Cell {
    index: number
    O?: boolean
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