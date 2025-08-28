import { useRouter } from "expo-router";
import { AppState } from "react-native";
import { useEffect, useRef, useState } from "react";
import { usePlayerContext } from "@/components/playerContext";
import { Request } from "@/internal/types";
import Router from "@/app/router";

export default function WebSocketWrapper() {
  // --------------------------------------------------------------------------------------
  // Context
  const { setCard, setClass, code, setCode, idRef } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // Refs
  const wsRef = useRef<WebSocket | null>(null);

  const router = useRouter();

  const [reload, setReload] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (nextState: string) => {
      if (
        nextState === "active" &&
        wsRef.current?.readyState !== WebSocket.OPEN
      ) {
        wsRef.current = new WebSocket(
          "wss://treachery.thekrew.app:3000/" + idRef?.current,
        );
        setReload((prev) => !prev);
      }
    };

    // Correct way: store subscription
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    if (wsRef.current === null) {
      wsRef.current = new WebSocket(
        "wss://treachery.thekrew.app:3000/" + idRef?.current,
      );
    }

    // Clean up using .remove()
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!wsRef.current) {
      return;
    }

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      const req: Request = {
        type: "info",
        method: "info",
        body: { code: "" },
      };
      wsRef.current?.send(JSON.stringify(req));
    };

    if (wsRef.current.readyState === WebSocket.OPEN && code !== "") {
      const req: Request = {
        type: "info",
        method: "info",
        body: { code: code },
      };
      wsRef.current.send(JSON.stringify(req));
    }
  }, [setCard, setClass, idRef, wsRef, router, setCode, code, reload]);

  // Start game handling

  return <Router wsRef={wsRef} />;
}
