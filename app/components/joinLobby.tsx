import { MoveRight } from "lucide-react-native";
import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { usePlayerContext } from "../internal/playerContext";

export default function JoinLobby({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // Context
  const { code, setCode } = usePlayerContext();

  // Animation
  const scale = useSharedValue(1);

  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const [text, onChangeText] = useState("");

  function handleJoinLobby(lcode: string) {
    if (!wsRef.current) {
      console.error("WebSocket is not initialized");
      return;
    }

    if (lcode && code === "") {
      wsRef.current?.send("J " + lcode);

      setCode(lcode);
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
        <Pressable
          className="w-12 h-12 items-center bg-purple-500/10 justify-center rounded-xl border border-transparent active:bg-purple-500/20 active:border-purple-400/50 transition-colors duration-200 ease-in-out "
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
        </Pressable>
      </View>
    </>
  );
}
