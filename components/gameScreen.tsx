import React from "react";
import { View, Text } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { getCardImage } from "@/internal/jsonloader";
import { BackSide, FlipCard, FrontSide } from "@/components/gameCard";
import GameRole from "@/components/gameRole";
import GameControls from "@/components/gameControls";
import { Player } from "@/internal/types";
import GameRoleTracker from "./gameRoleTracker";
import Container from "./ui/container";

export default function GameScreen({
  wsRef,
  role,
  card,
  players,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  role: number;
  card: number;
  players: Player[];
}) {
  // tailwindcss-class-safelist
  // text-blue-500 text-red-500 text-yellow-500

  const isFlipped = useSharedValue(1);

  const [unveiled, setUnveiled] = React.useState(false);
  const [didUnveil, setDidUnveil] = React.useState(false);

  React.useEffect(() => {
    // Leader is always shown
    if (role === 3) {
      isFlipped.value = withTiming(0, { duration: 0 });
      setUnveiled(true);
    } else {
      isFlipped.value = withTiming(1, { duration: 0 });
      setUnveiled(false);
    }

    if (didUnveil) {
      isFlipped.value = withTiming(0, { duration: 500 });
      setUnveiled(true);
    }
  }, [role, isFlipped, didUnveil]);

  if (role === -1 || card === -1) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <Container>
      <GameRole unveiled={unveiled} role={role} />
      <FlipCard
        isFlipped={isFlipped}
        FrontSide={<FrontSide url={getCardImage(role, card) || ""} />}
        BackSide={<BackSide />}
      />
      <GameRoleTracker players={players} />
      <GameControls
        wsRef={wsRef}
        role={role}
        isFlipped={isFlipped}
        unveiled={unveiled}
        setUnveiled={setUnveiled}
        players={players}
        didUnveil={didUnveil}
        setDidUnveil={setDidUnveil}
      />
    </Container>
  );
}
