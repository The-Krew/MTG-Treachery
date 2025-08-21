import { MoveRight } from "lucide-react-native";
import React, { useState } from "react";
import { View, TextInput, Keyboard } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePlayerContext } from "@/components/playerContext";
import { Button } from "@/components/ui/button";
import { useInfoModalContext } from "@/components/interface/status";

export default function JoinLobby({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { code, setCode } = usePlayerContext();
  const { openModal } = useInfoModalContext();

  // Animation
  const scale = useSharedValue(1);

  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const [text, onChangeText] = useState("");

  function handleJoinLobby(lcode: string) {
    Keyboard.dismiss();
    if (!wsRef.current) {
      console.error("WebSocket is not initialized");
      return;
    }

    if (lcode && code === "") {
      wsRef.current?.send("J " + lcode);

      setCode(lcode);
    } else if (lcode && code !== "") {
      openModal({
        title: "Error",
        message: "You are already in a lobby!",
        styleKey: "error",
      });
    } else {
      openModal({
        title: "Error",
        message: "Please enter a valid code!",
        styleKey: "error",
      });
    }
  }

  return (
    <>
      <View className=" w-full h-28 flex-row gap-8 bg-zinc-600/20 rounded-2xl  items-center justify-center px-4">
        <View className=" w-36  px-2 border-2 border-purple-300/50 rounded-lg bg-zinc-600/10 focus:bg-zinc-600/20  transition-colors duration-75 ease-in-out">
          <TextInput
            value={text}
            onChangeText={onChangeText}
            placeholder="XXXXXX"
            autoCapitalize="characters"
            placeholderTextColor="#9CA3AF"
            maxLength={6}
            style={{ textAlign: "center" }}
            className="text-white text-2xl font-bold"
          />
        </View>
        <Button
          size="xs"
          color="active"
          rounded="lg"
          onPress={() => {
            scale.value = withTiming(0.7, { duration: 100 }, (finished) => {
              if (finished) {
                scale.value = withTiming(1, { duration: 100 });
              }
            });
            handleJoinLobby(text);
            onChangeText("");
          }}
        >
          <Animated.View style={scaleAnimation}>
            <MoveRight size={32} color="white" />
          </Animated.View>
        </Button>
      </View>
    </>
  );
}
