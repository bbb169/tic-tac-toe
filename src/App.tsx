/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CellButton } from './component/cell-button';
import { log } from 'console';
import { Cell } from './libs/types';

function App() {
  const cells:Cell[] = Array.from({length:9},(e,i) => e = { index: i })
  const [ cellButtonsDom, setCellButtonsDom ] = React.useState(initButtons())
  console.log(cells);
  
  return <div style={cellsBoxStyle()}>
    { cellButtonsDom }
  </div>

  function handlePostion(cell: Cell) {
    switch (cell.index) {
      case 0: {
        return {
          right: cells[1],
          bottom: cells[3]
        }
      }
      case 1: {
        return {
          right: cells[2],
          left: cells[1]
        }
      }
      case 2: {
        return {
          left: cells[1],
          bottom: cells[5]
        }
      }
      case 3: {
        return {
          right: cells[4],
          top: cells[1]
        }
      }
      case 4: {
        return {
          right: cells[5],
          bottom: cells[7],
          left: cells[3],
          top: cells[1]
        }
      }
      case 5: {
        return {
          left: cells[4],
          bottom: cells[8],
          top: cells[3]
        }
      }
      case 6: {
        return {
          right: cells[7],
          top: cells[3]
        }
      }
      case 7: {
        return {
          right: cells[8],
          top: cells[4],
          left: cells[6]
        }
      }
      case 8: {
        return {
          top: cells[5],
          left: cells[7]
        }
      }
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
      cells[i] = { ...cells[i],...handlePostion(e) }
      return <CellButton key={i} state={e.O} style={cellButtonStyle} onCellClick={()=>{
        console.log(i);
        cells[i].O = false
        setCellButtonsDom(initButtons())
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


export default App;
