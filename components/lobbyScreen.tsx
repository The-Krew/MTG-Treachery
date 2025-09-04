import React from "react";
import { View, Text } from "react-native";
import { Play, LogOut } from "lucide-react-native";
import { usePlayerContext } from "@/components/playerContext";
import LobbyDetails from "@/components/lobbyDetails";
import LobbyPlayers from "@/components/lobbyPlayers";
import { useConfirmModalContext } from "@/components/interface/confirm";
import { Button } from "@/components/ui/button";
import { useInfoModalContext } from "@/components/interface/status";
import { Request } from "@/internal/types";
import Container from "./ui/container";
import Header from "./ui/header";
import LobbyJoin from "@/components/lobbyJoin";

export default function LobbyScreen({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { code, setCode, idRef } = usePlayerContext();
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
          const req: Request = {
            type: "lobby",
            method: "leave",
            body: { code: code },
          };
          wsRef.current?.send(JSON.stringify(req));
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
      const req: Request = {
        type: "game",
        method: "start",
        body: { code: code, rarity: "any" },
      };
      wsRef.current?.send(JSON.stringify(req));
    } else {
      openInfoModal({
        title: "Error",
        message: "You are not in a lobby!",
        styleKey: "error",
      });
    }
  }

  return (
    <Container>
      <Header>
        <Text className="text-white text-3xl font-bold">Lobby managment</Text>
      </Header>

      <LobbyDetails wsRef={wsRef} />
      <LobbyJoin wsRef={wsRef} />
      <LobbyPlayers />

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
    </Container>
  );
}
