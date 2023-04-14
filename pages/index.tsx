import Head from "next/head";
import styles from "@/styles/Home.module.css";
import ChessBoard from "@/components/chess/Board";
import { useState, useEffect } from "react";
import {
  dangerArea,
  getBlacks,
  getWhites,
  createCustomBoard,
  gameStatus,
  playerInfo,
} from "@/components/chess/functions";

export default function Home() {
  function playAudio() {
    const moveSound = new Audio("chess/sounds/move.mp3");
    moveSound.play();
  }

  const initialBoard = [
    "rook_black",
    "knight_black",
    "bishop_black",
    "queen_black",
    "king_black",
    "bishop_black",
    "knight_black",
    "rook_black",
  ]
    .concat(Array(8).fill("pawn_black"))
    .concat(Array(32).fill(""))
    .concat(Array(8).fill("pawn_white"))
    .concat([
      "rook_white",
      "knight_white",
      "bishop_white",
      "queen_white",
      "king_white",
      "bishop_white",
      "knight_white",
      "rook_white",
    ]);

  const [gameBoard, setGameBoard] = useState(
    createCustomBoard([
      { p: "king_white", pos: 60 },
      { p: "king_black", pos: 42 },
      { p: "rook_black", pos: 48 },
      { p: "rook_black", pos: 47 },
    ])
  );
  const [status, setStatus] = useState<{
    where2go: number[];
    checked: boolean;
  }>();
  const [lastMoveStart, setLastMoveStart] = useState(-1);
  const [lastMoveEnd, setLastMoveEnd] = useState(-1);
  const [whiteIsPlaying, setwhiteIsPlaying] = useState(true);
  const [dangerSquares, setDangerSquares] = useState(
    dangerArea(
      whiteIsPlaying,
      gameBoard,
      getWhites(gameBoard),
      getBlacks(gameBoard)
    )
  );

  function makeAmove(pos1: number, pos2: number) {
    //setLastMoveStart(pos1);
    //setLastMoveEnd(pos2);
    let game = [...gameBoard];
    game[pos2] = game[pos1];
    game[pos1] = "";
    setGameBoard(game);
    setwhiteIsPlaying(!whiteIsPlaying);
    setDangerSquares(
      dangerArea(!whiteIsPlaying, game, getWhites(game), getBlacks(game))
    );
    playAudio();
  }

  function finalMessage() {
    if (status?.where2go.length === 0 && status.checked) {
      return `Checkmate ${whiteIsPlaying ? "Black won" : "White won"}`;
    }
    if (status?.where2go.length === 0) {
      return "Draw";
    }
    if (status?.checked) {
      return "Check";
    }
    return "You can play";
  }

  useEffect(() => {
    setStatus(gameStatus(whiteIsPlaying, gameBoard, dangerSquares, true));
    console.log(playerInfo(whiteIsPlaying, gameBoard));
  }, [gameBoard]);

  return (
    <>
      <Head>
        <title>Multiplayer Chess</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>
          It's {whiteIsPlaying ? "white's" : "black's"} turn to make a move
        </h1>
        <ChessBoard
          board={gameBoard}
          whitePieces={getWhites(gameBoard)}
          blackPieces={getBlacks(gameBoard)}
          lastMoveStart={lastMoveStart}
          lastMoveEnd={lastMoveEnd}
          makeAmove={makeAmove}
          whiteIsPlaying={whiteIsPlaying}
          dangerSquares={dangerSquares}
        />
        <h1>{finalMessage()}</h1>
        {status?.where2go.length === 0 ? (
          <button
            onClick={() => {
              setGameBoard(initialBoard);
              setwhiteIsPlaying(true);
              setDangerSquares(
                dangerArea(
                  whiteIsPlaying,
                  initialBoard,
                  getWhites(initialBoard),
                  getBlacks(initialBoard)
                )
              );
            }}
          >
            Restart
          </button>
        ) : null}
      </main>
    </>
  );
}