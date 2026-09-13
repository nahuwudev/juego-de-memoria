export const Status = {
    "IDLE": "IDLE",
    "PLAYING": "PLAYING",
    "GAME_OVER": "GAME_OVER"
} as const

export type StatusType = typeof Status[keyof typeof Status];
export interface CardType {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean; // <-- no define la logica del game, solo su state individual para decidir si permanece o no descubierta. 
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  cards: CardType[];
  players: Player[];
  currentTurnPlayerId: string;
  selectedCardIds: string[]
  status: StatusType;
  winnerId: string | null;
}

// Interfaz para las acciones/métodos que expone cada motor
export interface UseGameEngine {
  gameState: GameState;
  playerAction: (cardId: string) => void;
  resetGame: () => void;
}

export const CARD_SYMBOLS = ["🚀", "👾", "🍕", "🎸", "🐱", "🌵", "⚽", "🎨"];
