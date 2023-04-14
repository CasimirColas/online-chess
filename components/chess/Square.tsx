import Piece from "./Pieces";
import styles from "@/styles/chess/Square.module.css";

interface Props {
  currentPiece: number;
  number: number;
  movableSquares: number[];
  takableSquares: number[];
  moveStart: number;
  moveEnd: number;
  assignedPiece: string;
  color: boolean;
  pieceAction: () => void;
  makeAmove: (pos1: number, pos2: number) => void;
  deSelect: () => void;
  dangerSquares: number[];
}

function Square(props: Props) {
  function squareColor() {
    if (props.dangerSquares.includes(props.number)) {
      return "orange";
    }
    if (props.takableSquares.includes(props.number)) {
      return "lightgray";
    }
    if (props.number === props.moveStart) {
      return "darkgoldenrod";
    }
    if (props.number === props.moveEnd) {
      return "yellow";
    }
    if (props.color) {
      return "beige";
    }
    return "lightgreen";
  }
  function takableSquare() {
    if (
      props.movableSquares.includes(props.number) &&
      !props.takableSquares.includes(props.number)
    ) {
      return (
        <div
          style={{
            borderRadius: "50%",
            backgroundColor: "darkgray",
            width: "25%",
            height: "25%",
          }}
        />
      );
    }
  }
  function conditionToMakeMove() {
    if (
      props.movableSquares.concat(props.takableSquares).includes(props.number)
    ) {
      props.makeAmove(props.currentPiece, props.number);
    }
    if (props.currentPiece != -1) {
      props.deSelect();
    }
  }
  return (
    <div
      className={styles.main}
      style={{ backgroundColor: squareColor() }}
      onClick={() => conditionToMakeMove()}
    >
      <p>{props.number}</p>
      {props.assignedPiece === "" ? null : (
        <Piece
          name={props.assignedPiece}
          pos={props.number}
          pieceAction={props.pieceAction}
        />
      )}
      {takableSquare()}
    </div>
  );
}

export default Square;
