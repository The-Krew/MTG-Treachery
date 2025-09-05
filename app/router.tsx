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

export default function Router({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { openModal } = useInfoModalContext();
  const { setCode, setRole, setCard } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // State

  const [players, setPlayers] = React.useState<Player[]>([]);

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
              const pBody: InfoPreParsed = res.body as InfoPreParsed;
              const ps: Player[] = [];
              for (const p of pBody.players) {
                ps.push({ name: p, role: "" });
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
                  setPlayers((prevPlayers) =>
                    prevPlayers.map((p) =>
                      p.name === uBody.player.name
                        ? { ...p, role: uBody.player.role }
                        : p,
                    ),
                  );
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
  }, [wsRef, openModal, players, setCode, setRole, setCard]);
  // --------------------------------------------------------------------------------------
  // Render
  if (!gameState) {
    return <LobbyScreen wsRef={wsRef} players={players} />;
  } else {
    return <GameScreen wsRef={wsRef} players={players} />;
  }
}
