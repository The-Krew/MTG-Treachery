// This is context file for player

import { Card, Player } from "@/internal/types";
import { createContext, useContext } from "react";

export interface PlayerContextType {
  idRef?: React.MutableRefObject<string | undefined>;
  code: string;
  role: string;
  card: Card;
  players: Player[];
  gameState: boolean;
  unveiled: boolean;
  setRole: (classIndex: string) => void;
  setCard: (cardIndex: Card) => void;
  setCode: (code: string) => void;
  setPlayers: (players: Player[]) => void;
  setGameState: (state: boolean) => void;
  setUnveiled: (unveiled: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined,
);

export const usePlayerContext = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};

export function generateCode() {
  // This function would generate a unique code for the lobby
  // size is set to 6 characters
  return Math.random().toString(36).substring(2, 4).toUpperCase();
}
