/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell, Directions } from './libs/types';

const players:{ No1: number[], No2: number[] } = { No1: [], No2: [] }
let currentPlayer: 'No1' | 'No2' =  'No1'

function App() {
  const cells:Cell[] = Array.from({length:9},(e,i) => e = { index: i })
  const [ cellButtonsDom, setCellButtonsDom ] = React.useState(initButtons())
  
  return <div style={cellsBoxStyle()}>
    { cellButtonsDom }
  </div>

  function handlePostion(cell: Cell) {
    const size = { row: 3, columns: 3 } //three rows and three columns 

    if ( ( cell.index + 1 ) %size.row !== 1 ) {
      cell.left = cells[ cell.index - 1 ]
    }

    if ( ( cell.index + 1 ) %size.row !== 0 ) {
      cell.right = cells[ cell.index + 1 ]
    }
    
    if ( (( cell.index + 1 )/size.columns) > 1 ) {
      cell.top = cells[ cell.index - size.row ]
    }

    if ( ( cell.index + 1 ) <= size.row*(size.columns - 1)  ) {
      cell.bottom = cells[ cell.index + size.row ]
    }
  }

  function initButtons() {
    const cellButtonStyle: React.CSSProperties = {
      width: '32%',
      height: '32%',
      fontSize: '100px',
      margin: '0.2%',
    }

    return cells.map((e,i)=> {
      handlePostion(cells[i])
      return <CellButton key={i} state={e.O} style={cellButtonStyle} onCellClick={()=>{
        onCellClick(cells,cells[i],()=>{
          setCellButtonsDom(initButtons())
        })
      }}/>
    })
  }

  function cellsBoxStyle():React.CSSProperties {
    return {
      display:'flex',
      flexWrap: 'wrap',
      width: '80vw',
      height: '80vh'
    }
  }
}

function resolveDirection(cell: Cell, directions: Directions[]) {
  return directions[1] ? 
  (cell[directions[0]]?.[directions[1]]) as Cell: 
  cell[directions[0]] as Cell
}

function isGameOver(cells: Cell[], currentPlayer: 'No1' | 'No2') {
  const playerPath = players[currentPlayer]
  const passed: number[] = []
  return consecutiveTimes(cells, cells[playerPath[playerPath.length -1]], 1)

  function consecutiveTimes(cells: Cell[], checkCell: Cell, times: number, directions?: Directions[]) {
    if (times >= 3) return true
    let enough = false

    playerPath.forEach( (e) => { //check whether path is consecutive
      if (e === checkCell.index) return //don't check itself
      if (passed.includes(e)) return //makes its finding not go back
      if (directions) {
        if (resolveDirection(checkCell,directions) === cells[e] ) {
          passed.push(checkCell.index)
          if (consecutiveTimes(cells, resolveDirection(checkCell,directions), times + 1, directions)) return enough = true
        }
        return 
      }

      // finding by eight directions
      if (resolveDirection(checkCell,[Directions.L]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.L]), times + 1, [Directions.L])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.L,Directions.T]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.L,Directions.T]), times + 1, [Directions.L,Directions.T])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.L,Directions.B]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.L,Directions.B]), times + 1, [Directions.L,Directions.B])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.T]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.T]), times + 1, [Directions.T])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.T,Directions.R]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.T,Directions.R]), times + 1, [Directions.T,Directions.R])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.R]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.R]), times + 1, [Directions.R])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.R,Directions.B]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.R,Directions.B]), times + 1, [Directions.R,Directions.B])) return enough = true
      } else if (resolveDirection(checkCell,[Directions.B]) === cells[e] ) {
        passed.push(checkCell.index)
        if (consecutiveTimes(cells, resolveDirection(checkCell,[Directions.B]), times + 1, [Directions.B])) return enough = true
      } 
    })

    return enough
  }
}

function onCellClick(cells:Cell[], cell:Cell,callBack: ()=> void) {
  if (cell.O !== undefined) return

  cell.O = (currentPlayer === 'No1' ? true : false)
  players[currentPlayer].push(cell.index)
  console.log(isGameOver(cells,currentPlayer))
  currentPlayer = (currentPlayer === 'No1' ? 'No2' : 'No1')
  callBack()
}

export default App;
