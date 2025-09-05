import "@/app/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { generateCode, PlayerContext } from "@/components/playerContext";
import React from "react";
import ConfirmModal from "@/components/interface/confirm";
import InfoModal from "@/components/interface/status";
import WebSocketWrapper from "@/app/index";
import { StatusBar } from "react-native";
import { Card, DefaultCard, Player } from "@/internal/types";
import RarityModal from "@/components/interface/rarity";

export default function Layout() {
  // Context setup for player
  const [role, setRole] = React.useState("");
  const [card, setCard] = React.useState<Card>(DefaultCard);
  const [code, setCode] = React.useState("");
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [gameState, setGameState] = React.useState<boolean>(false);
  const [unveiled, setUnveiled] = React.useState<boolean>(false);
  const idRef = React.useRef<string>(generateCode());

  const playerContextValue = {
    role,
    card,
    players,
    gameState,
    setRole,
    setCard,
    setPlayers,
    setGameState,
    code,
    setCode,
    idRef,
    unveiled,
    setUnveiled,
  };

  console.log("Player Context Value:", playerContextValue);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <ConfirmModal>
        <InfoModal>
          <RarityModal>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider value={DarkTheme}>
                <StatusBar hidden={true} />
                <WebSocketWrapper />
              </ThemeProvider>
            </GestureHandlerRootView>
          </RarityModal>
        </InfoModal>
      </ConfirmModal>
    </PlayerContext.Provider>
  );
}
