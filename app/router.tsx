import React from "react";
import { Response, Player } from "@/internal/types";
import LobbyScreen from "@/components/lobbyScreen";
import GameScreen from "@/components/gameScreen";
import { useInfoModalContext } from "@/components/interface/status";
import { getRandomCardIndex, roles } from "@/internal/jsonloader";

export default function Router({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { openModal } = useInfoModalContext();

  // --------------------------------------------------------------------------------------
  // State

  const [players, setPlayers] = React.useState<Player[]>([]);
  const [role, setRole] = React.useState<number>(-1);
  const [card, setCard] = React.useState<number>(-1);
  const [didUnveil, setDidUnveil] = React.useState<boolean>(false);

  const [gameState, setGameState] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        const message = event.data;
        console.log("Message from server:", message);

        try {
          const res: Response = JSON.parse(message);
          // INFO command
          if (res.type === "info") {
            if (res.method === "info" && res.body) {
              if ("players" in res.body && Array.isArray(res.body.players)) {
                const ps: Player[] = [];
                for (const player of res.body.players) {
                  const p: Player = {
                    name: player,
                  };
                  ps.push(p);
                }
                setPlayers(ps);
              }
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
                  const classIndexing = ["G", "A", "T", "L"];
                  const index = classIndexing.indexOf(res.body.role);
                  setRole(index);
                  setCard(getRandomCardIndex(roles[index]));
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
                setRole(-1);
                setCard(-1);
              }
            }
            return;
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };
    }
  }, [wsRef, openModal]);

  if (!gameState) {
    return <LobbyScreen wsRef={wsRef} players={players} />;
  } else {
    return <GameScreen wsRef={wsRef} role={role} card={card} />;
  }
}
