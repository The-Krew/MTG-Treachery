import React from "react";
import { View, Text } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { BackSide, FlipCard, FrontSide } from "@/components/gameCard";
import GameRole from "@/components/gameRole";
import GameControls from "@/components/gameControls";
import { DefaultCard } from "@/internal/types";
import GameRoleTracker from "./gameRoleTracker";
import Container from "./ui/container";
import { usePlayerContext } from "./playerContext";

export default function GameScreen({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // tailwindcss-class-safelist
  // text-blue-500 text-red-500 text-yellow-500

  const { role, card, setUnveiled, unveiled } = usePlayerContext();

  const isFlipped = useSharedValue(1);

  React.useEffect(() => {
    if (unveiled) {
      isFlipped.value = withTiming(0, { duration: 500 });
      return;
    }

    // Leader is always shown
    if (card.rolename === "Leader") {
      isFlipped.value = 0;
    } else {
      isFlipped.value = 1;
      setUnveiled(false);
    }
  }, [card, isFlipped, setUnveiled]);

  if (role === "" || card === DefaultCard) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <Container>
      <GameRole />
      <FlipCard
        isFlipped={isFlipped}
        FrontSide={<FrontSide url={card.url} />}
        BackSide={<BackSide />}
      />
      <GameRoleTracker />
      <GameControls wsRef={wsRef} isFlipped={isFlipped} />
    </Container>
  );
}
