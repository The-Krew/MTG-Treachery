import React from "react";
import { View, Text } from "react-native";
import { Button } from "./ui/button";
import { Player, Request } from "@/internal/types";
import { usePlayerContext } from "@/components/playerContext";
import { useConfirmModalContext } from "./interface/confirm";
import { withTiming } from "react-native-reanimated";
import { useInfoModalContext } from "./interface/status";

export default function GameControls({
  wsRef,
  role,
  isFlipped,
  unveiled,
  players,
  setUnveiled,
  didUnveil,
  setDidUnveil,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  role: number;
  isFlipped: any;
  unveiled: boolean;
  players: Player[];
  setUnveiled: React.Dispatch<React.SetStateAction<boolean>>;
  didUnveil: boolean;
  setDidUnveil: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { code } = usePlayerContext();
  const { openModal } = useConfirmModalContext();
  const { openModal: openInfoModal } = useInfoModalContext();

  React.useEffect(() => {
    if (role === 3) {
      const req: Request = {
        type: "game",
        method: "unveil",
        body: { code: code },
      };
      wsRef.current?.send(JSON.stringify(req));
    }
  }, [role, wsRef, code]);

  function handleLeave() {
    openModal({
      title: "Leave Game",
      message:
        "Are you sure you want to leave the game? Everyone will be put back to lobby.",
      onAcceptCallback: () => {
        const req: Request = {
          type: "game",
          method: "stop",
          body: { code: code },
        };
        wsRef.current?.send(JSON.stringify(req));
      },
    });
  }

  function handlePeek() {
    if (!unveiled) {
      openModal({
        title: "Peek Card",
        message: "Your card will be shown for 7 seconds. Cover your screen.",
        onAcceptCallback: () => {
          isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, {
            duration: 500,
          });
          setUnveiled(!unveiled);

          // Automatically flip back after 7 seconds if not unveiled
          if (!unveiled) {
            setTimeout(() => {
              if (!unveiled) {
                isFlipped.value = withTiming(1, { duration: 500 });
                setUnveiled(false);
              }
            }, 7000);
          }
        },
      });
    }
  }

  function handleUnveil() {
    if (role === 0) {
      // Role is Guardian and cannot unveil unless 2 players are unveiled (Leader + 1 more)
      console.log(players);
      if (players.filter((p) => p.role !== -1).length < 2) {
        openInfoModal({
          title: "Cannot Unveil",
          message:
            "As a Guardian, you can only unveil your card when at least one more player has unveiled theirs.",
          styleKey: "error",
        });
        return;
      }
    }
    openModal({
      title: "Unveil Card",
      message:
        "Are you sure you want to unveil your card? This action cannot be undone.",
      onAcceptCallback: () => {
        const req: Request = {
          type: "game",
          method: "unveil",
          body: { code: code },
        };
        wsRef.current?.send(JSON.stringify(req));
        setDidUnveil(true);
      },
    });
  }

  return (
    <>
      <View className="w-full h-20 items-center justify-center  flex flex-row gap-4">
        <Button color="danger" onPress={handleLeave} size="sm">
          <Text className="text-red-300">Leave </Text>
        </Button>

        <Button
          color={role !== 3 && !unveiled ? "primary" : "disabled"}
          onPress={role !== 3 && !unveiled ? handlePeek : () => {}}
          size="sm"
        >
          <Text className="text-blue-300">Peek </Text>
        </Button>
        <Button
          color={role !== 3 && !didUnveil ? "active" : "disabled"}
          onPress={role !== 3 && !didUnveil ? handleUnveil : () => {}}
          size="sm"
        >
          <Text className="text-purple-300">Unveil </Text>
        </Button>
      </View>
    </>
  );
}
