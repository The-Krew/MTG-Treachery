import React from "react";
import {
  Response,
  Player,
  DefaultCard,
  StartGameBody,
  UnveilBody,
  InfoPreParsed,
} from "@/internal/types";
import LobbyScreen from "@/components/lobbyScreen";
import GameScreen from "@/components/gameScreen";
import { useInfoModalContext } from "@/components/interface/status";
import { usePlayerContext } from "@/components/playerContext";
import Container from "@/components/ui/container";
import { Text } from "react-native";

export default function Router({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { openModal } = useInfoModalContext();
  const {
    setCode,
    setRole,
    setCard,
    players,
    setPlayers,
    setUnveiled,
    setGameState,
    gameState,
  } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // State

  React.useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const message = event.data;

        try {
          const res: Response = JSON.parse(message);
          // INFO command
          if (res.type === "info") {
            if (res.method === "info" && res.body) {
              const pBody: InfoPreParsed = res.body as InfoPreParsed;
              const ps: Player[] = [];
              for (const p of pBody.players) {
                const pparsed: Player = JSON.parse(p);
                ps.push({ name: pparsed.name, role: pparsed.role } as Player);
              }

              setPlayers(ps);
              return;
            }
          }
          // LOBBY command
          if (res.type === "lobby") {
            if (res.method === "create") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
              }
            }
            if (res.method === "join") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
                setCode("");
              }
            }
            if (res.method === "leave") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
              } else {
                setPlayers([]);
                setGameState(false);
              }
            }
            return;
          }
          // GAME command
          if (res.type === "game") {
            if (res.method === "start") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
              } else {
                setGameState(true);
                if (res.body && "role" in res.body) {
                  const gBody: StartGameBody = res.body as StartGameBody;
                  setRole(gBody.card.rolename);
                  setCard(gBody.card);
                }
              }
            }
            if (res.method === "stop") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
              } else {
                setGameState(false);
                setRole("");
                setCard(DefaultCard);
                setUnveiled(false);
                players.forEach((p) => (p.role = ""));
              }
            }
            if (res.method === "unveil") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
              } else {
                if (res.body) {
                  const uBody: UnveilBody = res.body as UnveilBody;
                  const pparsed: Player = JSON.parse(uBody.player as string);
                  const playersCopy = [...players];
                  const index = playersCopy.findIndex(
                    (p) => p.name === pparsed.name,
                  );

                  if (index !== -1) {
                    playersCopy[index].role = pparsed.role;
                  }
                  console.log(playersCopy);
                  setPlayers(playersCopy);
                }
              }
            }
            if (res.method === "lobby") {
              if (res.message) {
                openModal({
                  title: "Error",
                  message: res.message,
                  styleKey: "error",
                });
              } else {
                setGameState(false);
                setRole("");
                setCard(DefaultCard);
              }
            }
            return;
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };
    }
  }, [
    wsRef,
    openModal,
    players,
    setCode,
    setRole,
    setCard,
    setPlayers,
    setUnveiled,
    setGameState,
  ]);
  // --------------------------------------------------------------------------------------
  // Render
  if (!gameState) {
    return <LobbyScreen wsRef={wsRef} />;
  } else {
    return <GameScreen wsRef={wsRef} />;
  }
}
