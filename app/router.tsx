import React from "react";
import {
  Response,
  Player,
  DefaultCard,
  StartGameBody,
  UnveilBody,
  InfoPreParsed,
  StateBody,
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
  const {
    setCode,
    setRole,
    setCard,
    setPlayers,
    players,
    gameState,
    setGameState,
    setUnveiled,
    idRef,
  } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // State

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
              /*
               * -------------------------------
               * Info command for players
               * -------------------------------
               */
              const pBody: InfoPreParsed = res.body as InfoPreParsed;
              const pparsedList: Player[] = [];
              pBody.players.forEach((p: string) => {
                const pparsed = JSON.parse(p) as Player;
                pparsedList.push(pparsed);
              });
              setPlayers(pparsedList);
              return;
            } else if (res.method === "state" && res.body) {
              /*
               * -------------------------------
               * State command for reconnecting to grab all player info
               * -------------------------------
               */
              const stBody: StateBody = res.body as StateBody;
              console.log("StateBody router:", stBody);
              setCode(stBody.code);
              setGameState(stBody.running);
              setRole(stBody.role);
              setCard(stBody.card);

              const pparsedList: Player[] = [];
              stBody.players.forEach((p: string) => {
                const pparsed = JSON.parse(p) as Player;
                pparsedList.push(pparsed);
              });
              setPlayers(pparsedList);
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
                  if (gBody.card.rolename === "Leader") {
                    setUnveiled(true);
                    const ps: Player[] = [...players];
                    const index = ps.findIndex(
                      (p: Player) => p.name === idRef?.current,
                    );
                    if (index !== -1) {
                      ps[index].role = gBody.card.rolename;
                    }
                    setPlayers(ps);
                  }
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
                const ps: Player[] = [...players];
                ps.forEach((p: Player) => {
                  p.role = "";
                });
                setPlayers(ps);
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
                  console.log("Unveil body:", res.body);
                  const uBody: UnveilBody = res.body as UnveilBody;
                  const parsedPlayer = JSON.parse(uBody.player as any);

                  let roleString = "";
                  switch (parsedPlayer.role) {
                    case "L":
                      roleString = "Leader";
                      break;
                    case "G":
                      roleString = "Guardian";
                      break;
                    case "A":
                      roleString = "Assassin";
                      break;
                    case "T":
                      roleString = "Traitor";
                      break;
                  }

                  const ps: Player[] = [...players];
                  const index = ps.findIndex(
                    (p: Player) => p.name === parsedPlayer.name,
                  );
                  if (index !== -1) {
                    ps[index].role = roleString;
                  }

                  setPlayers(ps);
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
                setUnveiled(false);
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
    setGameState,
    setUnveiled,
    idRef,
  ]);
  // --------------------------------------------------------------------------------------
  // Render
  if (!gameState) {
    return <LobbyScreen wsRef={wsRef} />;
  } else {
    return <GameScreen wsRef={wsRef} />;
  }
}
