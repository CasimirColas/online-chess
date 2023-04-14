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

export function kingMoves(coord: { x: number; y: number }, danger: number[]) {
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
  ];
  return moves.filter((e) => !blocks.some((f) => f.x === e.x && f.y === e.y));
}
export function pawnMoves(
  coord: { x: number; y: number },
  isWhite: boolean,
  whitePieces: number[],
  blackPieces: number[]
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

  return moves;
}
//Gameplay
export function dangerArea(
  isWhite: boolean,
  board: string[],
  whitePieces: number[],
  blackPieces: number[]
) {
  const allPieces = whitePieces
    .concat(blackPieces)
    .filter((e) => e !== kingPlace(isWhite, board));
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
  console.log(deadKing);

  return deadKing.includes(kingPos);
}
export function gameStatus(
  isWhite: boolean,
  board: string[],
  dangerSquares: number[],
  fast: boolean
) {
  const allies = isWhite ? getWhites(board) : getBlacks(board);
  const whitePieces = getWhites(board);
  const blackPieces = getBlacks(board);
  const checked = dangerSquares.includes(kingPlace(isWhite, board));
  let availableMoves: number[] = [];

  for (let i = 0; i < allies.length; i++) {
    if (fast && availableMoves.length > 0) break;
    if (board[allies[i]] === `knight_${isWhite ? "white" : "black"}`) {
      availableMoves = availableMoves.concat(
        noTeamKill(
          getPlaces(boundMoves(knightMoves(getXY(allies[i])))).filter(
            (e) => !willThereBeDanger(isWhite, board, allies[i], e)
          ),
          allies
        )
      );
    }
    if (board[allies[i]] === `bishop_${isWhite ? "white" : "black"}`) {
      availableMoves = availableMoves.concat(
        noTeamKill(
          getPlaces(
            boundMoves(
              bishopMoves(getXY(allies[i]), whitePieces.concat(blackPieces))
            )
          ).filter((e) => !willThereBeDanger(isWhite, board, allies[i], e)),
          allies
        )
      );
    }
    if (board[allies[i]] === `rook_${isWhite ? "white" : "black"}`) {
      availableMoves = availableMoves.concat(
        noTeamKill(
          getPlaces(
            boundMoves(
              rookMoves(getXY(allies[i]), whitePieces.concat(blackPieces))
            )
          ).filter((e) => !willThereBeDanger(isWhite, board, allies[i], e)),
          allies
        )
      );
    }
    if (board[allies[i]] === `queen_${isWhite ? "white" : "black"}`) {
      availableMoves = availableMoves.concat(
        noTeamKill(
          getPlaces(
            boundMoves(
              queenMoves(getXY(allies[i]), whitePieces.concat(blackPieces))
            )
          ),
          allies
        )
      );
    }
    if (board[allies[i]] === `king_${isWhite ? "white" : "black"}`) {
      availableMoves = availableMoves.concat(
        noTeamKill(
          getPlaces(boundMoves(kingMoves(getXY(allies[i]), dangerSquares))),
          allies
        )
      );
    }
    if (board[allies[i]] === `pawn_${isWhite ? "white" : "black"}`) {
      availableMoves = availableMoves.concat(
        noTeamKill(
          getPlaces(
            boundMoves(
              pawnMoves(getXY(allies[i]), isWhite, whitePieces, blackPieces)
            )
          ).filter((e) => !willThereBeDanger(isWhite, board, allies[i], e)),
          allies
        )
      );
    }
  }
  return { where2go: availableMoves, checked: checked };
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
export function playerInfo(playerIsWhite: boolean, board: string[]) {
  const legacyBoard = board;
  const blacks = getBlacks(legacyBoard);
  const whites = getWhites(legacyBoard);
  const allPieces = blacks.concat(whites);
  const dangerSquares = dangerArea(playerIsWhite, legacyBoard, whites, blacks);
  const allies = playerIsWhite ? whites : blacks;

  const newBoard: { piece: string; pos: number; moves: number[] }[] = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === `knight_${playerIsWhite ? "white" : "black"}`) {
      newBoard.push({
        piece: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(knightMoves(getXY(i)))).filter(
            (e) => !willThereBeDanger(playerIsWhite, legacyBoard, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `bishop_${playerIsWhite ? "white" : "black"}`) {
      newBoard.push({
        piece: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(bishopMoves(getXY(i), allPieces))).filter(
            (e) => !willThereBeDanger(playerIsWhite, legacyBoard, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `rook_${playerIsWhite ? "white" : "black"}`) {
      newBoard.push({
        piece: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(rookMoves(getXY(i), allPieces))).filter(
            (e) => !willThereBeDanger(playerIsWhite, legacyBoard, i, e)
          ),
          allies
        ),
      });
    }
    if (board[i] === `queen_${playerIsWhite ? "white" : "black"}`) {
      newBoard.push({
        piece: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(queenMoves(getXY(i), allPieces))),
          allies
        ),
      });
    }
    if (board[i] === `king_${playerIsWhite ? "white" : "black"}`) {
      newBoard.push({
        piece: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(boundMoves(kingMoves(getXY(i), dangerSquares))),
          allies
        ),
      });
    }
    if (board[i] === `pawn_${playerIsWhite ? "white" : "black"}`) {
      newBoard.push({
        piece: board[i],
        pos: i,
        moves: noTeamKill(
          getPlaces(
            boundMoves(pawnMoves(getXY(i), playerIsWhite, whites, blacks))
          ).filter((e) => !willThereBeDanger(playerIsWhite, legacyBoard, i, e)),
          allies
        ),
      });
    }
  }
  const check = dangerSquares.includes(
    newBoard.filter(
      (e) => e.piece === `king_${playerIsWhite ? "white" : "black"}`
    )[0].pos
  );
  function areThereMoves2play() {
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i].moves.length > 0) {
        return true;
      }
    }
    return false;
  }

  return {
    playerIsWhite: playerIsWhite,
    check: check,
    canPlay: areThereMoves2play(),
    pieceMoves: newBoard,
    board: board,
  };
}
