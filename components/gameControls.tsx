import React from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "./ui/button";
import { Request } from "@/internal/types";
import { usePlayerContext } from "@/components/playerContext";
import { useConfirmModalContext } from "./interface/confirm";

export default function GameControls({
  wsRef,
  role,
  handlePress,
  unveiled,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  role: number;
  handlePress: () => void;
  unveiled: boolean;
}) {
  const { code } = usePlayerContext();
  const { openModal } = useConfirmModalContext();

  return (
    <>
      <View className="w-full h-14 items-center justify-center  flex flex-row gap-4">
        <Button
          color="danger"
          onPress={() => {
            const req: Request = {
              type: "game",
              method: "stop",
              body: { code: code },
            };
            wsRef.current?.send(JSON.stringify(req));
          }}
          size="sm"
        >
          <Text className="text-white">Leave </Text>
        </Button>

        <Button
          color={role !== 3 ? "primary" : "disabled"}
          onPress={role !== 3 ? handlePress : () => {}}
          size="sm"
        >
          <Text className="text-white">{!unveiled ? "Peek" : "Hide"} </Text>
        </Button>
        <Button
          color={role !== 3 ? "active" : "disabled"}
          onPress={
            role !== 3
              ? () => {
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
                    },
                  });
                }
              : () => {}
          }
          size="sm"
        >
          <Text className="text-white">Unveil </Text>
        </Button>
      </View>
    </>
  );
}
