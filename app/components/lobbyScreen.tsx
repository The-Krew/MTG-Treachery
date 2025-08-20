import React from "react";
import { View, Text, Pressable } from "react-native";
import { Play, LogOut } from "lucide-react-native";
import { usePlayerContext } from "../internal/playerContext";
import JoinLobby from "./joinLobby";
import LobbyDetails from "./lobbyDetails";
import LobbyPlayers from "./lobbyPlayers";

export default function LobbyScreen({
  wsRef,
  players,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  players: string[];
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { code, setCode } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // handlers
  function handleLeaveLobby() {
    if (code !== "") {
      wsRef.current?.send("L " + code);
      setCode("");
    }
  }

  function handleStartGame() {
    if (code !== "") {
      wsRef.current?.send("S " + code);
    }
  }

  return (
    <>
      <View className="w-full h-screen flex-1 flex-col px-4 items-center bg-zinc-900 gap-4">
        <View className="w-full h-20 items-center justify-center mt-10">
          <Text className="text-white text-3xl font-bold">
            Lobby managment{" "}
          </Text>
        </View>

        <LobbyDetails wsRef={wsRef} />
        <JoinLobby wsRef={wsRef} />
        <LobbyPlayers players={players} />

        <View className="w-full h-28 items-center justify-center flex flex-row gap-10">
          <Pressable
            className="w-44 h-24 bg-red-800/20 rounded-2xl items-center justify-center border border-transparent active:bg-red-600/30 active:border-red-400 transition-colors duration-75 ease-in-out"
            onPress={handleLeaveLobby}
          >
            <LogOut size={26} color="#D19D9D" />
            <Text
              className="text-md text-center mt-1"
              style={{ color: "#D19D9D" }}
            >
              Leave{" "}
            </Text>
          </Pressable>
          <Pressable
            className="w-44 h-24 bg-blue-700/20 rounded-2xl items-center justify-center border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={handleStartGame}
          >
            <Play size={26} color="#9DAFD1" />
            <Text
              className="text-md text-center mt-1"
              style={{ color: "#9DAFD1" }}
            >
              Start{" "}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
