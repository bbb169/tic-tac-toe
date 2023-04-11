/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './App.css';
import { CellButton } from './component/cell-button';
import { Cell } from './libs/types';

const players:{ No1: number[], No2: number[] } = { No1: [], No2: [] }
let currentPlayer: 'No1' | 'No2' =  'No1'

function App() {
  const cells:Cell[] = Array.from({length:9},(e,i) => e = { index: i })
  const [ cellButtonsDom, setCellButtonsDom ] = React.useState(initButtons())
  console.log(cells);
  
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
    
    if ( ( cell.index + 1 ) %size.columns > 1 ) {
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
        onCellClick(cells[i],()=>{
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

function onCellClick(cell:Cell,callBack: ()=> void) {
  cell.O = (currentPlayer === 'No1' ? true : false)
  players[currentPlayer].push(cell.index)
  currentPlayer = (currentPlayer === 'No1' ? 'No2' : 'No1')
  callBack()
  console.log(players)
}

export default App;
