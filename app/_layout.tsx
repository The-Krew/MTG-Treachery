import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
              drawerLabel: "Home",
            }}
          />
        </Drawer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
