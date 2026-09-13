import { type CardType } from "../types/game-state";

interface CardProps {
  card: CardType;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export const Card = ({ card, onSelect, disabled }: CardProps) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onSelect(card.id);
    }
  };

  const isFlippedOrMatched = card.isFlipped || card.isMatched;

  return (
    <button
      className={`card ${isFlippedOrMatched ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`}
      onClick={handleClick}
      disabled={disabled || card.isFlipped || card.isMatched}
    >
      <div className="card-inner">
        <div className="card-front">❓</div>
        <div className="card-back">{card.symbol}</div>
      </div>
    </button>
  );
};

export default Card;
