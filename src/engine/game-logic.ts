import { CARD_SYMBOLS, type CardType, type Player } from "../types/game-state";

export function calculateNextTurn(
  players: Player[],
  currentTurnPlayerId: string,
  isMatch: boolean,
) {
  // Si hizo match, repite el mismo jugador
  if (isMatch) {
    return currentTurnPlayerId;
  }

  // Si falla, pasa al siguiente en el arreglo
  const currentIndex = players.findIndex((p) => p.id === currentTurnPlayerId);
  const nextIndex = (currentIndex + 1) % players.length;

  return players[nextIndex].id;
}


const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateDeck = (): CardType[] => {
  // Duplicamos los símbolos para crear los pares
  const pairedSymbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS];

  // Mezclamos y mapeamos a la estructura CardType
  const deck = pairedSymbols.map((symbol, index) => ({
    id: `card-${index}-${Math.random().toString(36).substring(2, 7)}`,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));

  return shuffleArray(deck);
};
