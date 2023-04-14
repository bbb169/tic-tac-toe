export interface Cell {
    index: number;
    successed?: boolean;
    isO?: boolean; // means O or X
    right?: Cell;
    left?: Cell;
    top?: Cell;
    bottom?: Cell;
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
