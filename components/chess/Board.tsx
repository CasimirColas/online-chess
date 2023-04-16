import styles from "@/styles/chess/Board.module.css";
import { useState, useEffect } from "react";
import Square from "./Square";
import {
  boundMoves,
  getPlaces,
  getXY,
  knightMoves,
  noTeamKill,
  kill,
  bishopMoves,
  rookMoves,
  queenMoves,
  kingMoves,
  pawnMoves,
  willThereBeDanger,
} from "./functions";

interface Props {
  board: string[];
  pieceMoves: { name: string; pos: number; moves: number[] }[];
  ennemyPos: number[];
  makeAmove: (pos1: number, pos2: number) => void;
}

function ChessBoard({ board, makeAmove, pieceMoves, ennemyPos }: Props) {
  const [goToSquares, setGoToSquares] = useState<number[]>([]);
  const [takeSquares, setTakeSquares] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number>(-1);

  function deSelect() {
    setSelectedPiece(-1);
    setGoToSquares([]);
    setTakeSquares([]);
  }

  useEffect(() => {
    deSelect();
  }, [board]);

  function assignMoves(name: string, pos: number) {
    const piece = pieceMoves.filter((e) => e.name === name && e.pos === pos)[0];
    if (piece) {
      return () => {
        setSelectedPiece(pos);
        setGoToSquares(piece.moves);
        setTakeSquares(piece.moves.filter((e) => ennemyPos.includes(e)));
      };
    }
    return () => {};
  }

  function createBoard(arr: string[]) {
    let evenRow = false;
    let allsquares = [];

    for (let i = 0; i < arr.length; i++) {
      if (i % 8 === 0) {
        evenRow = !evenRow;
      }
      if (evenRow) {
        if (i % 2 === 0) {
          allsquares.push(
            <Square
              key={i}
              number={i}
              movableSquares={goToSquares}
              assignedPiece={arr[i]}
              color={true}
              takableSquares={takeSquares}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
            />
          );
        } else {
          allsquares.push(
            <Square
              key={i}
              number={i}
              movableSquares={goToSquares}
              assignedPiece={arr[i]}
              color={false}
              takableSquares={takeSquares}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
            />
          );
        }
      } else {
        if (i % 2 === 0) {
          allsquares.push(
            <Square
              key={i}
              number={i}
              movableSquares={goToSquares}
              assignedPiece={arr[i]}
              color={false}
              takableSquares={takeSquares}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
            />
          );
        } else {
          allsquares.push(
            <Square
              key={i}
              number={i}
              movableSquares={goToSquares}
              assignedPiece={arr[i]}
              color={true}
              takableSquares={takeSquares}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
            />
          );
        }
      }
    }

    return allsquares;
  }

  return (
    <>
      <div className={styles.board}>{createBoard(board)}</div>
    </>
  );
}

export default ChessBoard;
