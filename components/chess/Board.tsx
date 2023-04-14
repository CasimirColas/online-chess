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
  whitePieces: number[];
  blackPieces: number[];
  lastMoveStart: number;
  lastMoveEnd: number;
  makeAmove: (pos1: number, pos2: number) => void;
  whiteIsPlaying: boolean;
  dangerSquares: number[];
}

function ChessBoard({
  board,
  whitePieces,
  blackPieces,
  lastMoveStart,
  lastMoveEnd,
  makeAmove,
  whiteIsPlaying,
  dangerSquares,
}: Props) {
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
    function isWhite(name: string) {
      if (name.includes("white")) {
        return true;
      }
      return false;
    }

    function getAllies() {
      if (whiteIsPlaying) {
        return whitePieces;
      }
      return blackPieces;
    }
    function getEnnemies() {
      if (whiteIsPlaying) {
        return blackPieces;
      }
      return whitePieces;
    }

    if (name === `knight_${whiteIsPlaying ? "white" : "black"}`) {
      return () => {
        let moves = getPlaces(boundMoves(knightMoves(getXY(pos)))).filter(
          (e) => !willThereBeDanger(whiteIsPlaying, board, pos, e)
        );
        setSelectedPiece(pos);
        setGoToSquares(noTeamKill(moves, getAllies()));
        setTakeSquares(kill(moves, getEnnemies()));
      };
    }
    if (name === `bishop_${whiteIsPlaying ? "white" : "black"}`) {
      return () => {
        let moves = getPlaces(
          boundMoves(bishopMoves(getXY(pos), whitePieces.concat(blackPieces)))
        ).filter((e) => !willThereBeDanger(whiteIsPlaying, board, pos, e));
        setSelectedPiece(pos);
        setGoToSquares(noTeamKill(moves, getAllies()));
        setTakeSquares(kill(moves, getEnnemies()));
      };
    }
    if (name === `rook_${whiteIsPlaying ? "white" : "black"}`) {
      return () => {
        let moves = getPlaces(
          boundMoves(rookMoves(getXY(pos), whitePieces.concat(blackPieces)))
        ).filter((e) => !willThereBeDanger(whiteIsPlaying, board, pos, e));
        setSelectedPiece(pos);
        setGoToSquares(noTeamKill(moves, getAllies()));
        setTakeSquares(kill(moves, getEnnemies()));
      };
    }
    if (name === `queen_${whiteIsPlaying ? "white" : "black"}`) {
      return () => {
        let moves = getPlaces(
          boundMoves(queenMoves(getXY(pos), whitePieces.concat(blackPieces)))
        );
        setSelectedPiece(pos);
        setGoToSquares(noTeamKill(moves, getAllies()));
        setTakeSquares(kill(moves, getEnnemies()));
      };
    }
    if (name === `king_${whiteIsPlaying ? "white" : "black"}`) {
      return () => {
        let moves = getPlaces(boundMoves(kingMoves(getXY(pos), dangerSquares)));
        setSelectedPiece(pos);
        setGoToSquares(noTeamKill(moves, getAllies()));
        setTakeSquares(kill(moves, getEnnemies()));
      };
    }
    if (name === `pawn_${whiteIsPlaying ? "white" : "black"}`) {
      return () => {
        let moves = getPlaces(
          boundMoves(
            pawnMoves(getXY(pos), isWhite(name), whitePieces, blackPieces)
          )
        ).filter((e) => !willThereBeDanger(whiteIsPlaying, board, pos, e));
        setSelectedPiece(pos);
        setGoToSquares(noTeamKill(moves, getAllies()));
        setTakeSquares(kill(moves, getEnnemies()));
      };
    }
    return () => {};
  }

  function createBoard(arr: string[]) {
    let evenRow = false;
    let allsquares = [];
    let allpossiblemoves = [];

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
              moveStart={lastMoveStart}
              moveEnd={lastMoveEnd}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
              dangerSquares={dangerSquares}
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
              moveStart={lastMoveStart}
              moveEnd={lastMoveEnd}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
              dangerSquares={dangerSquares}
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
              moveStart={lastMoveStart}
              moveEnd={lastMoveEnd}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
              dangerSquares={dangerSquares}
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
              moveStart={lastMoveStart}
              moveEnd={lastMoveEnd}
              pieceAction={assignMoves(arr[i], i)}
              currentPiece={selectedPiece}
              deSelect={deSelect}
              makeAmove={makeAmove}
              dangerSquares={dangerSquares}
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
