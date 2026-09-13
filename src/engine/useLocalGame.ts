import { useState } from "react";
import {
  Status,
  type CardType,
  type GameState,
  type Player,
  type UseGameEngine,
} from "../types/game-state";
import { calculateNextTurn, generateDeck } from "./game-logic";

const updatePlayerScore = (
  players: Player[],
  currentTurnPlayerId: string,
): Player[] => {
  return players.map((p) =>
    p.id === currentTurnPlayerId ? { ...p, score: p.score + 1 } : p,
  );
};

const markCardAsMatched = (cards: CardType[], idA: string, idB: string) => {
  return cards.map((card) =>
    card.id === idA || card.id === idB
      ? { ...card, isFlipped: true, isMatched: true }
      : card,
  );
};

export const flipCardInList = (
  cards: CardType[],
  cardId: string,
): CardType[] => {
  return cards.map((card) =>
    card.id === cardId ? { ...card, isFlipped: true } : card,
  );
};

function resetFlippedCards(
  cards: CardType[],
  idA: string,
  idB: string,
): CardType[] {
  return cards.map((card) =>
    card.id === idA || card.id === idB ? { ...card, isFlipped: false } : card,
  );
}

export function useLocalGame(): UseGameEngine {
  const [gameState, setGameState] = useState<GameState>({
    cards: generateDeck(), // cartas iniciales mezcladas
    players: [{ id: "p1", name: "Jugador 1", score: 0 }],
    currentTurnPlayerId: "p1",
    status: Status.PLAYING,
    selectedCardIds: [],
    winnerId: null,
  });

  const playerAction = (cardId: string) => {
    const { cards, selectedCardIds } = gameState;

    const targetCard = cards.find((c) => c.id === cardId);

    // Guard Clause 1: Validaciones de entrada
    if (!targetCard || targetCard.isFlipped || selectedCardIds.length >= 2) {
      return;
    }

    // Actualizamos temporalmente las cartas y la selección actual
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card,
    );
    const newSelectedIds = [...selectedCardIds, cardId];

    // Guard Clause 2: Si es apenas la primera carta, guardamos y salimos
    if (newSelectedIds.length < 2) {
      setGameState((prev) => ({
        ...prev,
        cards: updatedCards,
        selectedCardIds: newSelectedIds,
      }));
      return;
    }

    const [firstId, secondId] = newSelectedIds;
    const firstCard = updatedCards.find((c) => c.id === firstId);
    const secondCard = updatedCards.find((c) => c.id === secondId);

    if (!firstCard || !secondCard) return;

    const isMatch = firstCard.symbol === secondCard.symbol;

    // CASO 1: HAY MATCH
    if (isMatch) {
      setTimeout(() => {
        setGameState((prev) => {
          const matchedCards = markCardAsMatched(prev.cards, firstId, secondId);
          const updatedPlayers = updatePlayerScore(
            prev.players,
            prev.currentTurnPlayerId,
          );

          return {
            ...prev,
            cards: matchedCards,
            players: updatedPlayers,
            selectedCardIds: [],
          };
        });
      }, 500);

      return;
    }

    // CASO 2: NO HUBO MATCH

    // 1. Mostramos la 2da carta elegida momentáneamente
    setGameState((prev) => ({
      ...prev,
      cards: updatedCards,
      selectedCardIds: newSelectedIds,
    }));

    // 2. Esperamos 1 segundo, desvolteamos y pasamos de turno
    setTimeout(() => {
      setGameState((prev) => {
        const nextPlayerId = calculateNextTurn(
          prev.players,
          prev.currentTurnPlayerId,
          false,
        );

        const resetCards = resetFlippedCards(
          prev.cards,
          firstCard.id,
          secondCard.id,
        );

        return {
          ...prev,
          cards: resetCards,
          selectedCardIds: [],
          currentTurnPlayerId: nextPlayerId,
        };
      });
    }, 1000);
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      cards: generateDeck(),
      players: prev.players.map((p) => ({ ...p, score: 0 })),
      currentTurnPlayerId: prev.players[0]?.id ?? "",
      selectedCardIds: [],
      status: Status.PLAYING,
    }));
  };

  return { gameState, playerAction, resetGame };
}
