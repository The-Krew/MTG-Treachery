import React from "react";
import { View, Text } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { getCardImage } from "@/internal/jsonloader";
import { BackSide, FlipCard, FrontSide } from "@/components/gameCard";
import GameRole from "@/components/gameRole";
import GameControls from "@/components/gameControls";

export default function GameScreen({
  wsRef,
  role,
  card,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  role: number;
  card: number;
}) {
  // tailwindcss-class-safelist
  // text-blue-500 text-red-500 text-yellow-500

  const isFlipped = useSharedValue(1);

  const [unveiled, setUnveiled] = React.useState(false);

  React.useEffect(() => {
    // Leader is always shown
    if (role === 3) {
      isFlipped.value = withTiming(0, { duration: 0 });
      setUnveiled(true);
    } else {
      isFlipped.value = withTiming(1, { duration: 0 });
      setUnveiled(false);
    }
  }, [role, isFlipped]);

  const handlePress = () => {
    isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, {
      duration: 500,
    });
    setUnveiled(!unveiled);
  };

  if (role === -1 || card === -1) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex pt-10 pb-56 px-4 items-center flex-col w-full h-full bg-zinc-900 gap-2">
      <GameRole unveiled={unveiled} role={role} />
      <FlipCard
        isFlipped={isFlipped}
        FrontSide={<FrontSide url={getCardImage(role, card) || ""} />}
        BackSide={<BackSide />}
      />
      <GameControls
        wsRef={wsRef}
        role={role}
        handlePress={handlePress}
        unveiled={unveiled}
      />
    </View>
  );
}
