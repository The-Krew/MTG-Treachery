import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Text } from "react-native";

export default function Layout() {
  return (
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
  );
}
