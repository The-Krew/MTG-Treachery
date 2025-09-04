import { AppState } from "react-native";
import { useEffect, useRef, useState } from "react";
import { usePlayerContext } from "@/components/playerContext";
import {
  DefaultCard,
  Player,
  Request,
  Response,
  StateBody,
} from "@/internal/types";
import Router from "@/app/router";
import ServerConnect from "@/components/serverConnect";

export default function WebSocketWrapper() {
  // --------------------------------------------------------------------------------------
  // Context
  const {
    code,
    idRef,
    setPlayers,
    setCode,
    setRole,
    setCard,
    setGameState,
    setUnveiled,
  } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // Refs
  const wsRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [retry, setRetry] = useState(false);

  // Warm boot handling
  useEffect(() => {
    const handleAppStateChange = (nextState: string) => {
      if (
        nextState === "active" &&
        wsRef.current?.readyState !== WebSocket.OPEN
      ) {
        wsRef.current = new WebSocket(
          "wss://treachery.thekrew.app:3000/" + idRef?.current,
        );
        wsRef.current.onopen = () => {
          const req = {
            type: "info",
            method: "state",
            body: { code },
          };
          wsRef.current?.send(JSON.stringify(req));
        };
        wsRef.current.onmessage = (event) => {
          const message = event.data;
          console.log("Message from server:", message);

          try {
            const res: Response = JSON.parse(message);

            if (res.method === "state" && res.body) {
              /*
               * -------------------------------
               * State command for reconnecting to grab all player info
               * -------------------------------
               */
              const stBody: StateBody = res.body as StateBody;
              console.log("StateBody index:", stBody);
              setCode(stBody.code);
              setGameState(stBody.running);
              setRole(stBody.role);
              setCard(stBody.card);
              setUnveiled(stBody.unveiled);

              const pparsedList: Player[] = [];
              stBody.players.forEach((p: string) => {
                const pparsed = JSON.parse(p) as Player;
                pparsedList.push(pparsed);
              });
              setPlayers(pparsedList);
            }
          } catch (error) {
            console.error("Failed to parse message from server:", error);
          }
        };
      }
      console.log("AppState changed to", nextState);
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [idRef]);

  // Cold boot handling
  useEffect(() => {
    if (!idRef?.current) return;

    if (wsRef.current === null || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log(idRef?.current);
      wsRef.current = new WebSocket(
        "wss://treachery.thekrew.app:3000/" + idRef?.current,
      );
    }

    wsRef.current.onopen = () => {
      setConnected(true);
      const req: Request = {
        type: "info",
        method: "state",
        body: { code: "" },
      };
      console.log("WebSocket connected sending state request");
      wsRef.current?.send(JSON.stringify(req));
    };

    wsRef.current.onclose = (event) => {
      setConnected(false);

      setCard(DefaultCard);
      setRole("");
      setPlayers([]);
      setCode("");

      wsRef.current = null;
    };

    // Clean up on unmount
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [retry]);

  // Ping server every 10 seconds to keep connection alive
  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const req: Request = {
          type: "ping",
          method: "heartbeat",
          body: { code: "" },
        };
        wsRef.current.send(JSON.stringify(req));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Start game handling
  if (!connected) {
    return (
      <ServerConnect
        onRetry={() => {
          setRetry((prev) => !prev);
        }}
      />
    );
  }

  return <Router wsRef={wsRef} />;
}
