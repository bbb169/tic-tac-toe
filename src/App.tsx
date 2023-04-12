/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./App.css";
import { CellButton } from "./component/cell-button";
import { Cell, Directions, ReverseDirections } from "./libs/types";
import { Button, message } from "antd";
import { cellButtonStyle, cellsBoxStyle } from "./libs/style";

const players: { No1: number[]; No2: number[] } = { No1: [], No2: [] };
const cells: Cell[] = Array.from({ length: 9 }, (e, i) => (e = { index: i }));
let currentPlayer: "No1" | "No2" = "No1";
let gameOver = false;
let hadPlaced = false;

function App() {
  const [cellButtonsDom, setCellButtonsDom] = React.useState(initButtons());
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <div style={cellsBoxStyle}>{cellButtonsDom}</div>
      <Button
        type={"primary"}
        onClick={() => {
          goBack(cells, () => {
            setCellButtonsDom(initButtons());
          });
        }}
      >
        Go Back
      </Button>
    </>
  );

  function initButtons() {
    if (!hadPlaced) {
      cells.forEach((_, i) => {
        handlePostion(cells[i]);
      });
      hadPlaced = true;
    }

    return cells.map((e, i) => {
      return (
        <CellButton
          key={i}
          state={e.O}
          style={cellButtonStyle}
          onCellClick={() => {
            onCellClick(
              cells,
              cells[i],
              () => {
                setCellButtonsDom(initButtons());
              },
              () => {
                messageApi.open({
                  type: "success",
                  content: "Game Over!",
                });
              }
            );
          }}
        />
      );
    });
  }
}

function handlePostion(cell: Cell) {
  //make out each cell's nearby cells.
  const size = { row: 3, columns: 3 }; //three rows and three columns

  if ((cell.index + 1) % size.row !== 1) {
    cell.left = cells[cell.index - 1];
  }

  if ((cell.index + 1) % size.row !== 0) {
    cell.right = cells[cell.index + 1];
  }

  if ((cell.index + 1) / size.columns > 1) {
    cell.top = cells[cell.index - size.row];
  }

  if (cell.index + 1 <= size.row * (size.columns - 1)) {
    cell.bottom = cells[cell.index + size.row];
  }
}

function resolveDirection(
  cell: Cell,
  directions: Directions[],
  reverse?: boolean
) {
  let innerDirections = directions;
  if (reverse) innerDirections = directions.map((e) => toReverse(e));

  return innerDirections[1]
    ? (cell[innerDirections[0]]?.[innerDirections[1]] as Cell)
    : (cell[innerDirections[0]] as Cell);

  function toReverse(direction: Directions) {
    const rdirection = ReverseDirections[direction];
    return rdirection as unknown as Directions;
  }
}

function isGameOver(cells: Cell[], currentPlayer: "No1" | "No2") {
  const playerPath = players[currentPlayer];
  const passed: number[] = [];
  return consecutiveTimes(cells, cells[playerPath[playerPath.length - 1]], 1);

  function consecutiveTimes(
    cells: Cell[],
    checkCell: Cell,
    times: number,
    directions?: Directions[]
  ) {
    if (times >= 3) return true;
    let enough = false;

    playerPath.forEach((e) => {
      //check whether path is consecutive
      if (e === checkCell.index) return; //don't check itself
      if (passed.includes(e)) return; //makes its finding not go back
      if (directions) return findByDirection(directions, e); //finding way is only need focus one direction

      // finding by eight directions
      findByDirection([Directions.L], e);
      findByDirection([Directions.L, Directions.T], e);
      findByDirection([Directions.L, Directions.B], e);
      findByDirection([Directions.T], e);
      findByDirection([Directions.T, Directions.R], e);
      findByDirection([Directions.R], e);
      findByDirection([Directions.R, Directions.B], e);
      findByDirection([Directions.B], e);
    });

    return enough;

    function findByDirection(directions: Directions[], e: number) {
      if (enough) return;

      if (resolveDirection(checkCell, directions) === cells[e]) {
        passed.push(checkCell.index);
        const totalTimes =
          oneDirectionTimes(checkCell, directions) +
          oneDirectionTimes(checkCell, directions, true); // search in two directions
        if (totalTimes >= 2) return (enough = true);
      }

      function oneDirectionTimes(
        checkCell: Cell,
        directions: Directions[],
        reverse?: boolean
      ) {
        const nextCell = resolveDirection(checkCell, directions, reverse);
        if (!nextCell) return 0;

        let times = 0;

        if (playerPath.includes(nextCell.index)) {
          times += oneDirectionTimes(nextCell, directions, reverse) + 1; //find next in this direction.
        }
        return times;
      }
    }
  }
}

function onCellClick(
  cells: Cell[],
  cell: Cell,
  callBack: () => void,
  messageOpen: () => void
) {
  if (cell.O !== undefined || gameOver) return;

  cell.O = currentPlayer === "No1" ? true : false;
  players[currentPlayer].push(cell.index);

  gameOver = isGameOver(cells, currentPlayer); //check whether is game over every time
  if (gameOver) messageOpen();
  currentPlayer = currentPlayer === "No1" ? "No2" : "No1";
  callBack();
}

function goBack(cells: Cell[], callBack: () => void) {
  gameOver = false;
  currentPlayer = currentPlayer === "No1" ? "No2" : "No1";

  // clear current player's last one path
  const player = players[currentPlayer];
  cells[player[player.length - 1]].O = undefined;
  player.splice(player.length - 1, 1);
  callBack();
}

export default App;
