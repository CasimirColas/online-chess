//Interfaces
export interface gameInfo {
  playerIsWhite: boolean;
  check: boolean;
  canPlay: boolean;
  ennemyPos: number[];
  pieceMoves: { name: string; pos: number; moves: number[] }[];
  board: string[];
  whiteCastle: {
    kingMoved: boolean;
    rookRMoved: boolean;
    rookLMoved: boolean;
  };
  blackCastle: {
    kingMoved: boolean;
    rookRMoved: boolean;
    rookLMoved: boolean;
  };

  jumpPawn: number | null;
}
//Default Values
export const defaultSpecial = {
  whiteCastle: {
    kingMoved: false,
    rookRMoved: false,
    rookLMoved: false,
  },
  blackCastle: {
    kingMoved: false,
    rookRMoved: false,
    rookLMoved: false,
  },

  jumpPawn: null,
};
export const initialBoard = [
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
//Utility
export function kingPlace(isWhite: boolean, board: string[]) {
  return board.indexOf(`king_${isWhite ? "white" : "black"}`);
}
export function getWhites(arr: string[]) {
  let pieces = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes("white")) {
      pieces.push(i);
    }
  }
  return pieces;
}
export function getBlacks(arr: string[]) {
  let pieces = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes("black")) {
      pieces.push(i);
    }
  }
  return pieces;
}
export function getX(pos: number) {
  return pos % 8;
}
export function getY(pos: number) {
  return (pos - (pos % 8)) / 8;
}
export function getXY(pos: number) {
  return { x: pos % 8, y: (pos - (pos % 8)) / 8 };
}
export function getPlace(x: number, y: number) {
  return y * 8 + x;
}
export function getPlaces(moves: { x: number; y: number }[]) {
  return moves.map((e) => e.y * 8 + e.x);
}
export function boundMoves(moves: { x: number; y: number }[]) {
  return moves.filter((e) => e.x >= 0 && e.x <= 7 && e.y >= 0 && e.y <= 7);
}
export function boundPlaces(moves: { x: number; y: number }[]) {
  return getPlaces(boundMoves(moves));
}
export function noTeamKill(boundPlaces: number[], allies: number[]) {
  return boundPlaces.filter((e) => !allies.includes(e));
}
export function kill(boundPlaces: number[], ennemies: number[]) {
  return boundPlaces.filter((e) => ennemies.includes(e));
}
//Moves
export function knightMoves(coord: { x: number; y: number }) {
  return [
    { x: coord.x - 1, y: coord.y - 2 },
    { x: coord.x + 1, y: coord.y - 2 },
    { x: coord.x - 2, y: coord.y - 1 },
    { x: coord.x + 2, y: coord.y - 1 },
    { x: coord.x - 2, y: coord.y + 1 },
    { x: coord.x + 2, y: coord.y + 1 },
    { x: coord.x - 1, y: coord.y + 2 },
    { x: coord.x + 1, y: coord.y + 2 },
  ];
}
export function bishopMoves(coord: { x: number; y: number }, pieces: number[]) {
  //Defining every diagonal of a bishop's move set
  let branchTopLeft: { x: number; y: number }[] = [];
  let branchTopRigh: { x: number; y: number }[] = [];
  let branchBottomLeft: { x: number; y: number }[] = [];
  let branchBottomRight: { x: number; y: number }[] = [];
  //Get every square where the bishop could move
  for (let i = 1; i <= 7; i++) {
    branchBottomRight.push({ x: coord.x + i, y: coord.y + i });
    branchTopRigh.push({ x: coord.x + i, y: coord.y - i });
    branchBottomLeft.push({ x: coord.x - i, y: coord.y + i });
    branchTopLeft.push({ x: coord.x - i, y: coord.y - i });
    if (
      coord.x - i < 0 &&
      coord.x + i > 7 &&
      coord.y - i < 0 &&
      coord.y + i > 7
    )
      break;
  }
  //Get every piece on the bishop's path
  const blocks = pieces
    .map((e) => getXY(e))
    .filter((e) =>
      branchTopLeft
        .concat(branchTopRigh)
        .concat(branchBottomLeft)
        .concat(branchBottomRight)
        .some((f) => f.x === e.x && f.y === e.y)
    );
  //For every piece on the bishop's path remove any possible space behind it
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].x > coord.x && blocks[i].y > coord.y) {
      let mark = branchBottomRight.findIndex(
        (e) => e.x === blocks[i].x && e.y === blocks[i].y
      );
      branchBottomRight = branchBottomRight.slice(0, mark + 1);
    }
    if (blocks[i].x > coord.x && blocks[i].y < coord.y) {
      let mark = branchTopRigh.findIndex(
        (e) => e.x === blocks[i].x && e.y === blocks[i].y
      );
      branchTopRigh = branchTopRigh.slice(0, mark + 1);
    }
    if (blocks[i].x < coord.x && blocks[i].y > coord.y) {
      let mark = branchBottomLeft.findIndex(
        (e) => e.x === blocks[i].x && e.y === blocks[i].y
      );
      branchBottomLeft = branchBottomLeft.slice(0, mark + 1);
    }
    if (blocks[i].x < coord.x && blocks[i].y < coord.y) {
      let mark = branchTopLeft.findIndex(
        (e) => e.x === blocks[i].x && e.y === blocks[i].y
      );
      branchTopLeft = branchTopLeft.slice(0, mark + 1);
    }
  }
  //return all possible moves for the bishop
  return branchTopLeft
    .concat(branchTopRigh)
    .concat(branchBottomLeft)
    .concat(branchBottomRight);
}

export function rookMoves(coord: { x: number; y: number }, pieces: number[]) {
  //get every piece situated where the rook can move
  const blocks = pieces
    .map((e) => getXY(e))
    .filter((e) => e.x === coord.x || e.y === coord.y);
  //get every x and y positions of pieces where the rook can move in 2 separate arrays
  const xpos = Array.from(new Set(blocks.map((e) => e.x)));
  const ypos = Array.from(new Set(blocks.map((e) => e.y)));
  //get the closest piece to the rook
  const closeTop = Math.max(...ypos.filter((e) => e < coord.y), 0);
  const closeBottom = Math.min(...ypos.filter((e) => e > coord.y), 7);
  const CloseLeft = Math.max(...xpos.filter((e) => e < coord.x), 0);
  const CloseRight = Math.min(...xpos.filter((e) => e > coord.x), 7);

  const moves: { x: number; y: number }[] = [];
  //Creating every square where the rook can move vertically by creating square coordinates between the top and the bottom
  for (let i = closeTop; i < closeBottom + 1; i++) {
    moves.push({ x: coord.x, y: i });
  }
  //Likewise from left to right
  for (let i = CloseLeft; i < CloseRight + 1; i++) {
    moves.push({ x: i, y: coord.y });
  }
  //return all the created squares
  return moves.filter((e) => e.x !== coord.x || e.y !== coord.y);
}

export function queenMoves(coord: { x: number; y: number }, pieces: number[]) {
  return rookMoves(coord, pieces).concat(bishopMoves(coord, pieces));
}

export function kingMoves(
  coord: { x: number; y: number },
  danger: number[],
  castle: { kingMoved: boolean; rookRMoved: boolean; rookLMoved: boolean },
  leftLineIsEmpty: boolean,
  rightLineIsEmpty: boolean,
  dangerL: boolean,
  dangerR: boolean,
  check: boolean
) {
  const blocks = danger.map((e) => getXY(e));
  const moves = [
    { x: coord.x, y: coord.y + 1 },
    { x: coord.x, y: coord.y - 1 },
    { x: coord.x + 1, y: coord.y },
    { x: coord.x - 1, y: coord.y },
    { x: coord.x + 1, y: coord.y + 1 },
    { x: coord.x - 1, y: coord.y - 1 },
    { x: coord.x + 1, y: coord.y - 1 },
    { x: coord.x - 1, y: coord.y + 1 },
  ].filter((e) => !blocks.some((f) => f.x === e.x && f.y === e.y));
  if (!castle.kingMoved && !check) {
    if (
      !castle.rookLMoved &&
      leftLineIsEmpty &&
      !dangerL &&
      moves.some((e) => e.x === coord.x - 1 && e.y === coord.y)
    ) {
      moves.push({ x: coord.x - 2, y: coord.y });
    }
    if (
      !castle.rookRMoved &&
      rightLineIsEmpty &&
      !dangerR &&
      moves.some((e) => e.x === coord.x + 1 && e.y === coord.y)
    ) {
      moves.push({ x: coord.x + 2, y: coord.y });
    }
  }
  return moves;
}
export function pawnMoves(
  coord: { x: number; y: number },
  isWhite: boolean,
  whitePieces: number[],
  blackPieces: number[],
  jumpPawn: number | null
) {
  const moves: { x: number; y: number }[] = [];
  const ennemySquares = isWhite
    ? blackPieces.map((e) => getXY(e))
    : whitePieces.map((e) => getXY(e));
  const forwardDirection = isWhite ? -1 : 1;
  const jumpLine = isWhite ? 6 : 1;

  //Can he go forward
  if (
    !ennemySquares.some(
      (e) => e.x === coord.x && e.y === coord.y + forwardDirection
    )
  ) {
    moves.push({ x: coord.x, y: coord.y + forwardDirection });
  }
  //Can he jump
  if (coord.y === jumpLine) {
    if (
      !whitePieces
        .concat(blackPieces)
        .map((e) => getXY(e))
        .some(
          (e) =>
            (e.x === coord.x && e.y === coord.y + forwardDirection) ||
            (e.x === coord.x && e.y === coord.y + 2 * forwardDirection)
        )
    ) {
      moves.push({ x: coord.x, y: coord.y + 2 * forwardDirection });
    }
  }
  //Can he eat left
  if (
    ennemySquares.some(
      (e) => e.x === coord.x - 1 && e.y === coord.y + forwardDirection
    )
  ) {
    moves.push({ x: coord.x - 1, y: coord.y + forwardDirection });
  }

  //Can he eat right
  if (
    ennemySquares.some(
      (e) => e.x === coord.x + 1 && e.y === coord.y + forwardDirection
    )
  ) {
    moves.push({ x: coord.x + 1, y: coord.y + forwardDirection });
  }
  //Can he eat en passant
  if (
    jumpPawn &&
    (getX(jumpPawn) + 1 === coord.x || getX(jumpPawn) - 1 === coord.x)
  ) {
    moves.push({ x: getX(jumpPawn), y: getY(jumpPawn) + forwardDirection });
  }
  return moves;
}
//Gameplay
export function dangerArea(
  isWhite: boolean,
  board: string[],
  whitePieces: number[],
  blackPieces: number[]
) {
  const allPieces = whitePieces.concat(blackPieces);
  const ennemies = isWhite ? blackPieces : whitePieces;
  let dangerSquares: { x: number; y: number }[] = [];

  for (let i = 0; i < ennemies.length; i++) {
    if (board[ennemies[i]] === `knight_${isWhite ? "black" : "white"}`) {
      dangerSquares = dangerSquares.concat(knightMoves(getXY(ennemies[i])));
    }
    if (board[ennemies[i]] === `bishop_${isWhite ? "black" : "white"}`) {
      dangerSquares = dangerSquares.concat(
        bishopMoves(getXY(ennemies[i]), allPieces)
      );
    }
    if (board[ennemies[i]] === `rook_${isWhite ? "black" : "white"}`) {
      dangerSquares = dangerSquares.concat(
        rookMoves(getXY(ennemies[i]), allPieces)
      );
    }
    if (board[ennemies[i]] === `queen_${isWhite ? "black" : "white"}`) {
      dangerSquares = dangerSquares.concat(
        queenMoves(getXY(ennemies[i]), allPieces)
      );
    }
    if (board[ennemies[i]] === `king_${isWhite ? "black" : "white"}`) {
      const { x, y } = getXY(ennemies[i]);
      dangerSquares = dangerSquares.concat([
        { x: x, y: y + 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y },
        { x: x - 1, y: y },
        { x: x + 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
      ]);
    }
    if (board[ennemies[i]] === `pawn_${isWhite ? "black" : "white"}`) {
      const { x, y } = getXY(ennemies[i]);
      if (isWhite) {
        dangerSquares = dangerSquares.concat(
          { x: x + 1, y: y + 1 },
          { x: x - 1, y: y + 1 }
        );
      }
      if (!isWhite) {
        dangerSquares = dangerSquares.concat(
          { x: x + 1, y: y - 1 },
          { x: x - 1, y: y - 1 }
        );
      }
    }
  }

  return Array.from(new Set(boundPlaces(dangerSquares)));
}
export function willThereBeDanger(
  isWhite: boolean,
  board: string[],
  pos1: number,
  pos2: number
) {
  let game = [...board];
  game[pos2] = game[pos1];
  game[pos1] = "";
  const kingPos = kingPlace(isWhite, game);
  const deadKing = dangerArea(isWhite, game, getWhites(game), getBlacks(game));

  return deadKing.includes(kingPos);
}
//Playground
export function createCustomBoard(pieces: { p: string; pos: number }[]) {
  let game = Array(64).fill("");
  for (let i = 0; i < pieces.length; i++) {
    game[pieces[i].pos] = pieces[i].p;
  }
  return game;
}
//Server side
export function playerInfo(
  playerIsWhite: boolean,
  board: string[],
  special: {
    whiteCastle: {
      kingMoved: boolean;
      rookRMoved: boolean;
      rookLMoved: boolean;
    };
    blackCastle: {
      kingMoved: boolean;
      rookRMoved: boolean;
      rookLMoved: boolean;
    };

    jumpPawn: number | null;
  }
): gameInfo {
  const blacks = getBlacks(board);
  const whites = getWhites(board);
  const allPieces = blacks.concat(whites);
  const dangerSquares = dangerArea(playerIsWhite, board, whites, blacks);
  const allies = playerIsWhite ? whites : blacks;
  const castle = playerIsWhite ? special.whiteCastle : special.blackCastle;

  const check = dangerSquares.includes(
    board.findIndex((e) => e === `king_${playerIsWhite ? "white" : "black"}`)
  );

  //Castle possibility checking
  let leftLineIsEmpty = true;
  let rightLineIsEmpty = true;
  let dangerL = false;
  let dangerR = false;

  const emptyLlinecheck = playerIsWhite ? [57, 58, 59] : [1, 2, 3];
  const emptyRlinecheck = playerIsWhite ? [61, 62] : [5, 6];
  const dangerLcheck = playerIsWhite ? [58, 59] : [2, 3];
  const dangerRcheck = playerIsWhite ? [61, 62] : [5, 6];

  for (let i = 0; i < emptyLlinecheck.length; i++) {
    if (board[emptyLlinecheck[i]] !== "") {
      leftLineIsEmpty = false;
      break;
    }
  }
  for (let i = 0; i < emptyRlinecheck.length; i++) {
    if (board[emptyRlinecheck[i]] !== "") {
      rightLineIsEmpty = false;
      break;
    }
  }
  for (let i = 0; i < dangerLcheck.length; i++) {
    if (dangerSquares.includes(dangerLcheck[i])) {
      dangerL = true;
      break;
    }
  }
  for (let i = 0; i < dangerRcheck.length; i++) {
    if (dangerSquares.includes(dangerLcheck[i])) {
      dangerR = true;
      break;
    }
  }

  const pieceMoves: { name: string; pos: number; moves: number[] }[] = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === `knight_${playerIsWhite ? "white" : "black"}`) {
      pieceMoves.push({
        name: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(knightMoves(getXY(i)))).filter(
            (e) => !willThereBeDanger(playerIsWhite, board, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `bishop_${playerIsWhite ? "white" : "black"}`) {
      pieceMoves.push({
        name: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(bishopMoves(getXY(i), allPieces))).filter(
            (e) => !willThereBeDanger(playerIsWhite, board, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `rook_${playerIsWhite ? "white" : "black"}`) {
      pieceMoves.push({
        name: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(rookMoves(getXY(i), allPieces))).filter(
            (e) => !willThereBeDanger(playerIsWhite, board, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `queen_${playerIsWhite ? "white" : "black"}`) {
      pieceMoves.push({
        name: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(queenMoves(getXY(i), allPieces))).filter(
            (e) => !willThereBeDanger(playerIsWhite, board, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `king_${playerIsWhite ? "white" : "black"}`) {
      pieceMoves.push({
        name: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(
            boundMoves(
              kingMoves(
                getXY(i),
                dangerSquares,
                castle,
                leftLineIsEmpty,
                rightLineIsEmpty,
                dangerL,
                dangerR,
                check
              )
            )
          ).filter((e) => !willThereBeDanger(playerIsWhite, board, i, e)),
          allies
        ),
      });
    }
    if (board[i] === `pawn_${playerIsWhite ? "white" : "black"}`) {
      pieceMoves.push({
        name: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(
            boundMoves(
              pawnMoves(
                getXY(i),
                playerIsWhite,
                whites,
                blacks,
                special.jumpPawn
              )
            )
          ).filter((e) => !willThereBeDanger(playerIsWhite, board, i, e)),
          allies
        ),
      });
    }
  }

  function areThereMoves2play() {
    for (let i = 0; i < pieceMoves.length; i++) {
      if (pieceMoves[i].moves.length > 0) {
        return true;
      }
    }
    return false;
  }

  return {
    playerIsWhite: playerIsWhite,
    check: check,
    canPlay: areThereMoves2play(),
    pieceMoves: pieceMoves,
    board: board,
    ennemyPos: playerIsWhite ? blacks : whites,
    whiteCastle: special.whiteCastle,
    blackCastle: special.blackCastle,
    jumpPawn: special.jumpPawn,
  };
}
export function makeAmove(
  pos1: number,
  pos2: number,
  info: gameInfo,
  requestedPiece: string | null
): gameInfo {
  let specialMoveDone = false;
  const playerColor = info.playerIsWhite ? "white" : "black";
  const castleL = info.playerIsWhite ? 58 : 2;
  const castleR = info.playerIsWhite ? 62 : 6;
  const castleLennemy = info.playerIsWhite ? 2 : 58;
  const castleRennemy = info.playerIsWhite ? 6 : 62;
  const validPromotePieces = ["rook", "queen", "knight", "bishop"];
  const promoteLine = info.playerIsWhite
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [56, 57, 58, 59, 60, 61, 63, 63];
  const movedPiece = info.pieceMoves.find((e) => e.pos === pos1);
  //Copies
  let { board } = info;
  let jumpPawn = info.jumpPawn;
  let whiteCastle = { ...info.whiteCastle };
  let blackCastle = { ...info.blackCastle };
  const myCastle = info.playerIsWhite ? whiteCastle : blackCastle;
  //Basic error handeling
  if (!movedPiece) {
    console.error("no piece found");

    return info;
  }
  if (!movedPiece.moves.includes(pos2)) {
    console.error("this piece cannot move here");
    return info;
  }
  //Handle special Logic here

  //En passant trigger
  if (
    movedPiece.name === `pawn_${playerColor}` &&
    Math.abs(getY(pos1) - getY(pos2)) === 2
  ) {
    jumpPawn = pos2;
  } else {
    jumpPawn = null;
  }
  //Possibility for castle update

  if (!myCastle.kingMoved) {
    //Checking king
    if (movedPiece.name === `king_${playerColor}`) {
      if (info.playerIsWhite) {
        whiteCastle.kingMoved = true;
      }
      if (!info.playerIsWhite) {
        blackCastle.kingMoved = true;
      }
    }
    //Checking left rook
    if (
      movedPiece.name === `rook_${playerColor}` &&
      movedPiece.pos === castleL
    ) {
      if (info.playerIsWhite) {
        whiteCastle.rookLMoved = true;
      }
      if (!info.playerIsWhite) {
        blackCastle.rookLMoved = true;
      }
    }
    //Checking right rook
    if (
      movedPiece.name === `rook_${playerColor}` &&
      movedPiece.pos === castleR
    ) {
      if (info.playerIsWhite) {
        whiteCastle.rookRMoved = true;
      }
      if (!info.playerIsWhite) {
        blackCastle.rookRMoved = true;
      }
    }
  }
  //Left rook has been eaten
  if (pos2 === castleLennemy - 1) {
    if (!info.playerIsWhite) {
      whiteCastle.rookLMoved = true;
    }
    if (info.playerIsWhite) {
      blackCastle.rookLMoved = true;
    }
  }
  //Right rook has been eaten
  if (pos2 === castleRennemy + 1) {
    if (!info.playerIsWhite) {
      whiteCastle.rookRMoved = true;
    }
    if (info.playerIsWhite) {
      blackCastle.rookRMoved = true;
    }
  }
  //En passant move for white
  if (
    info.jumpPawn &&
    movedPiece.name === "pawn_white" &&
    getY(pos2) === getY(info.jumpPawn) - 1
  ) {
    specialMoveDone = true;
    board[info.jumpPawn] = "";
    board[pos1] = "";
    board[pos2] = "pawn_white";
  }
  //En passant move for black
  if (
    info.jumpPawn &&
    movedPiece.name === "pawn_black" &&
    getY(pos2) === getY(info.jumpPawn) + 1
  ) {
    specialMoveDone = true;
    board[info.jumpPawn] = "";
    board[pos1] = "";
    board[pos2] = "pawn_black";
  }
  //Pawn promote
  if (movedPiece.name === `pawn_${playerColor}` && promoteLine.includes(pos2)) {
    if (requestedPiece && validPromotePieces.includes(requestedPiece)) {
      specialMoveDone = true;
      board[pos1] = "";
      board[pos2] = requestedPiece + `_${playerColor}`;
    } else {
      console.error(`Incorrect promote piece, got: ${requestedPiece}`);
      return info;
    }
  }

  //Castle left side
  if (movedPiece.name === `king_${playerColor}` && pos2 === castleL) {
    specialMoveDone = true;
    if (info.playerIsWhite) {
      board[60] = "";
      board[56] = "";
      board[59] = "rook_white";
      board[58] = "king_white";
    }
    if (!info.playerIsWhite) {
      board[4] = "";
      board[0] = "";
      board[3] = "rook_black";
      board[2] = "king_black";
    }
  }
  //Castle right side
  if (movedPiece.name === `king_${playerColor}` && pos2 === castleR) {
    specialMoveDone = true;
    if (info.playerIsWhite) {
      board[60] = "";
      board[63] = "";
      board[61] = "rook_white";
      board[62] = "king_white";
    }
    if (!info.playerIsWhite) {
      board[4] = "";
      board[7] = "";
      board[5] = "rook_black";
      board[6] = "king_black";
    }
  }

  //Normal move
  if (!specialMoveDone) {
    board[pos2] = board[pos1];
    board[pos1] = "";
  }

  //New Player info
  const special = {
    whiteCastle: whiteCastle,
    blackCastle: blackCastle,
    jumpPawn: jumpPawn,
  };
  const newPlayerInfo = playerInfo(!info.playerIsWhite, board, special);
  return newPlayerInfo;
}
