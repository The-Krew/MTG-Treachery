import "@/app/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { generateCode, PlayerContext } from "@/components/playerContext";
import React from "react";
import ConfirmModal from "@/components/interface/confirm";
import InfoModal from "@/components/interface/status";
import { Slot } from "expo-router";

export default function Layout() {
  // Context setup for player
  const [cardClass, setCardClass] = React.useState(-1);
  const [card, setCard] = React.useState(-1);
  const [code, setCode] = React.useState("");
  const idRef = React.useRef<string>(generateCode());

  const playerContextValue = {
    cardClass: cardClass,
    card,
    setClass: setCardClass,
    setCard,
    code,
    setCode,
    idRef: idRef,
  };

  console.log("Player Context Value:", playerContextValue);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <ConfirmModal>
        <InfoModal>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={DarkTheme}>
              <Slot />
            </ThemeProvider>
          </GestureHandlerRootView>
        </InfoModal>
      </ConfirmModal>
    </PlayerContext.Provider>
  );
}

/*
              <Drawer>
                <Drawer.Screen
                  name="lobby"
                  options={{
                    title: "lobby",
                    headerShown: false,
                    drawerLabel: "Lobby",
                  }}
                />
                <Drawer.Screen
                  name="index"
                  options={{
                    title: "Home",
                    headerShown: false,
                    drawerLabel: "Home",
                  }}
                />
              </Drawer>
*/
