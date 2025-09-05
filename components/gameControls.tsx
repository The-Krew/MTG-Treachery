import React from "react";
import { View, Text } from "react-native";
import { Button } from "./ui/button";
import { Request } from "@/internal/types";
import { usePlayerContext } from "@/components/playerContext";
import { useConfirmModalContext } from "./interface/confirm";
import { withTiming } from "react-native-reanimated";
import { useInfoModalContext } from "./interface/status";

export default function GameControls({
  wsRef,
  isFlipped,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  isFlipped: any;
}) {
  const { code, setUnveiled, unveiled, players, card } = usePlayerContext();
  const { openModal } = useConfirmModalContext();
  const { openModal: openInfoModal } = useInfoModalContext();

  const [peeked, setPeeked] = React.useState(false);

  React.useEffect(() => {
    if (card.rolename === "Leader") {
      const req: Request = {
        type: "game",
        method: "unveil",
        body: { code: code },
      };
      wsRef.current?.send(JSON.stringify(req));
      setUnveiled(true);
    }
  }, []);

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
          isFlipped.value = withTiming(0, {
            duration: 500,
          });
          setPeeked(true);
          setTimeout(hidePeek, 7000);
        },
      });
    }
  }

  function hidePeek() {
    if (!unveiled) {
      isFlipped.value = withTiming(1, { duration: 500 });
      setPeeked(false);
    }
  }

  function handleUnveil() {
    if (card.rolename === "Guardian") {
      // Role is Guardian and cannot unveil unless 2 players are unveiled (Leader + 1 more)
      if (players.filter((p) => p.role !== "").length < 2) {
        openModal({
          title: "Guardian Unveil Restriction",
          message: "Did someone attack Leader?",
          onAcceptCallback: () => {
            const req: Request = {
              type: "game",
              method: "unveil",
              body: { code: code },
            };
            wsRef.current?.send(JSON.stringify(req));
            setUnveiled(true);
          },

          onCancelCallback: () => {
            openInfoModal({
              title: "Unveil Cancelled",
              message: "You need some else to unveil to use this action.",
              styleKey: "error",
            });
          },
        });
        return;
      } else {
        const req: Request = {
          type: "game",
          method: "unveil",
          body: { code: code },
        };
        wsRef.current?.send(JSON.stringify(req));
        setUnveiled(true);
      }
    }
    // Normal unveil process
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
        setUnveiled(true);
        isFlipped.value = withTiming(0, { duration: 500 });
      },
    });
  }

  const disableCheck = card.rolename === "Leader" || unveiled || peeked;

  return (
    <>
      <View className="w-full h-[5rem] items-center justify-center  flex flex-row gap-4">
        <Button color="danger" onPress={handleLeave} size="sm">
          <Text className="text-red-300">Leave </Text>
        </Button>

        <Button
          color={!disableCheck ? "primary" : "disabled"}
          onPress={!disableCheck ? handlePeek : () => {}}
          size="sm"
        >
          <Text className="text-blue-300">Peek </Text>
        </Button>
        <Button
          color={!disableCheck ? "active" : "disabled"}
          onPress={!disableCheck ? handleUnveil : () => {}}
          size="sm"
        >
          <Text className="text-purple-300">Unveil </Text>
        </Button>
      </View>
    </>
  );
}
