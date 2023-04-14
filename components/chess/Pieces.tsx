interface Props {
  name: string;
  pos: number;
  pieceAction: () => void;
}

export default function Piece({ name, pieceAction }: Props) {
  return (
    <img
      src={`/chess/${name}.png`}
      alt={name}
      style={{ width: "90%", height: "90%", cursor: "pointer" }}
      onClick={() => pieceAction()}
    />
  );
}
