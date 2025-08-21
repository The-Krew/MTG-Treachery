import React from "react";
import { View, Text } from "react-native";
import { Play, LogOut } from "lucide-react-native";
import { usePlayerContext } from "@/components/playerContext";
import JoinLobby from "@/components/joinLobby";
import LobbyDetails from "@/components/lobbyDetails";
import LobbyPlayers from "@/components/lobbyPlayers";
import { useConfirmModalContext } from "@/components/interface/confirm";
import { Button } from "@/components/ui/button";
import { useInfoModalContext } from "@/components/interface/status";

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
  const { openModal } = useConfirmModalContext();
  const { openModal: openInfoModal } = useInfoModalContext();

  // --------------------------------------------------------------------------------------
  // handlers
  function handleLeaveLobby() {
    if (code !== "") {
      openModal({
        title: "Leave Lobby",
        message: "Are you sure you want to leave the lobby?",
        onAcceptCallback: () => {
          wsRef.current?.send("L " + code);
          setCode("");
        },
      });
    } else {
      openInfoModal({
        title: "Error",
        message: "You are not in a lobby!",
        styleKey: "error",
      });
    }
  }

  function handleStartGame() {
    if (code !== "") {
      wsRef.current?.send("S " + code);
    } else {
      openInfoModal({
        title: "Error",
        message: "You are not in a lobby!",
        styleKey: "error",
      });
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
          <Button size="md" color="danger" onPress={handleLeaveLobby}>
            <LogOut size={26} color="#D19D9D" />
            <Text
              className="text-md text-center mt-1"
              style={{ color: "#D19D9D" }}
            >
              Leave{" "}
            </Text>
          </Button>
          <Button color="primary" size="md" onPress={handleStartGame}>
            <Play size={26} color="#9DAFD1" />
            <Text
              className="text-md text-center mt-1"
              style={{ color: "#9DAFD1" }}
            >
              Start{" "}
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
}
