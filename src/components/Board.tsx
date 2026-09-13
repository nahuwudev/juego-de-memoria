import { type UseGameEngine } from "../types/game-state";
import Card from "./Card";

interface BoardProps {
  engine: UseGameEngine;
}

export const Board = ({ engine }: BoardProps) => {
  const { gameState, playerAction , resetGame } = engine;
  const { cards, players, currentTurnPlayerId, selectedCardIds } = gameState;

  // Deshabilitar interacción si ya hay 2 cartas abiertas esperando resolución
  const isBoardDisabled = selectedCardIds.length >= 2;

  return (
    <div className="game-container">
      {/* Marcador de Jugadores */}
      <header className="scoreboard">
        {players.map((player) => {
          const isCurrentTurn = player.id === currentTurnPlayerId;
          return (
            <div
              key={player.id}
              className={`player-card ${isCurrentTurn ? "active-turn" : ""}`}
            >
              <span className="player-name">{player.name}</span>
              <span className="player-score">Puntos: {player.score}</span>
            </div>
          );
        })}
      </header>

      {/* Grilla de Cartas */}
      <main className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onSelect={playerAction}
            disabled={isBoardDisabled}
          />
        ))}
      </main>

      {/* Acciones */}
      <footer className="controls">
        <button onClick={resetGame} className="reset-btn">
          Reiniciar Juego 🔄
        </button>
      </footer>
    </div>
  );
};
