import { useRouter } from "expo-router";
import { AppState } from "react-native";
import { useEffect, useRef, useState } from "react";
import { usePlayerContext } from "@/components/playerContext";
import { cardClasses, getRandomCardIndex } from "@/internal/jsonloader";
import LobbyScreen from "@/components/lobbyScreen";
import { useInfoModalContext } from "@/components/interface/status";

export default function LobbyWrapper() {
  // --------------------------------------------------------------------------------------
  // Context
  const { setCard, setClass, code, setCode, idRef } = usePlayerContext();
  const { openModal } = useInfoModalContext();

  // --------------------------------------------------------------------------------------
  // Refs
  const wsRef = useRef<WebSocket | null>(null);

  const router = useRouter();

  const [players, setPlayers] = useState<string[]>([]);
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
      wsRef.current?.send("I");
    };

    wsRef.current.onmessage = (event) => {
      const message = event.data;
      console.log("Message from server:", message);
      // TODO: handle messages from serve
      // messages that can come from the server
      // "C/J/L-0" - Ok
      // "C/J/L/S/I-1" - Error
      //
      // "[creatorId, ...., pNid]"
      // "S-A/T/G/L" char of a class when game starts
      //
      if (message.startsWith("[")) {
        const data = JSON.parse(message);
        if (data.length > 0) {
          setPlayers(data);
        }
      }

      if (message.startsWith("C")) {
        const res = message.split("-")[1];

        if (res !== "0") {
          setCode("");
          openModal({
            title: "Error",
            message: "Failed to create lobby, please try again.",
            styleKey: "error",
          });
        }
      }

      if (message.startsWith("J")) {
        const res = message.split("-")[1];

        if (res !== "0") {
          setCode("");
          setPlayers([]);
        } else {
          openModal({
            title: "Error",
            message: "Failed to join lobby, please try again.",
            styleKey: "error",
          });
        }
      }

      if (message.startsWith("L")) {
        const res = message.split("-")[1];

        if (res === "0") {
          setCode("");
          setPlayers([]);
        } else {
          openModal({
            title: "Error",
            message: "Failed to leave lobby, please try again.",
            styleKey: "error",
          });
        }
      }

      if (message.startsWith("S")) {
        const res = message.split("-")[1];
        if (res !== "1") {
          const classIndexing = ["G", "A", "T", "L"];

          const index = classIndexing.indexOf(res);

          setClass(index);
          setCard(getRandomCardIndex(cardClasses[index]));

          router.push("/game");
        } else {
          openModal({
            title: "Warning",
            message:
              "Not enough players to start the game. \n Minimum 4 players required.",
            styleKey: "warning",
          });
        }
      }

      if (message.startsWith("I")) {
        const res = message.split("-")[1];
        if (res !== "0") {
          if (code !== "" && code) {
            wsRef.current?.send("J " + code);
          } else {
            setCode("");
            setPlayers([]);
          }
        }
      }
    };

    if (wsRef.current.readyState === WebSocket.OPEN && code !== "") {
      wsRef.current.send("I");
    }
  }, [setCard, setClass, idRef, wsRef, router, setCode, code, reload]);

  // Start game handling

  return <LobbyScreen wsRef={wsRef} players={players} />;
}
