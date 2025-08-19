import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Text } from "react-native";
import { PlayerContext } from "./internal/playerContext";
import React from "react";

export default function Layout() {
  // Context setup for player
  const [cardClass, setCardClass] = React.useState(-1);
  const [card, setCard] = React.useState(-1);

  const playerContextValue = {
    cardClass: cardClass,
    card,
    setClass: setCardClass,
    setCard,
  };

  console.log("Player Context Value:", playerContextValue);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={DarkTheme}>
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
            <Text> aaa </Text>
          </Drawer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PlayerContext.Provider>
  );
}
