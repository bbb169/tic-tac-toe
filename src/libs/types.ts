export interface Cell {
    index: number
    O?: boolean
    right?: Cell
    left?: Cell
    top?: Cell
    bottom?: Cell
}