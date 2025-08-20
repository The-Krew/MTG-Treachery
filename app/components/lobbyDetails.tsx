import React from "react";
import { View, Text, Pressable, Share } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CirclePlus, Copy, Share2 } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { generateCode, usePlayerContext } from "../internal/playerContext";

export default function LobbyDetails({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // States
  const { code, setCode } = usePlayerContext();

  // --------------------------------------------------------------------------------------
  // Create animation
  const rotationC = useSharedValue(0);
  const scaleC = useSharedValue(1);

  const rotateAnimationC = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationC.value}deg` }],
  }));

  const scaleAnimationC = useAnimatedStyle(() => ({
    transform: [{ scale: scaleC.value }],
  }));

  // --------------------------------------------------------------------------------------
  // Copy animation
  const scaleP = useSharedValue(1);
  const scaleAnimationP = useAnimatedStyle(() => ({
    transform: [{ scale: scaleP.value }],
  }));

  // --------------------------------------------------------------------------------------
  // Copy animation
  const scaleS = useSharedValue(1);
  const scaleAnimationS = useAnimatedStyle(() => ({
    transform: [{ scale: scaleS.value }],
  }));

  // --------------------------------------------------------------------------------------
  // Handlers

  function handleCreateLobby() {
    if (code === "") {
      // Frontend logic
      rotationC.value = withTiming(360, { duration: 600 }, (finished) => {
        if (finished) {
          rotationC.value = 0; // Reset rotation after completion
        }
      });

      // Backend logic
      const genCode = generateCode();
      if (genCode && genCode !== "") {
        setCode(genCode);
        wsRef.current?.send("C " + genCode);
        wsRef.current?.send("I " + genCode);

        setCode(genCode);
      }
    } else {
      scaleC.value = withTiming(0.7, { duration: 100 }, (finished) => {
        if (finished) {
          scaleC.value = withTiming(1, { duration: 100 });
        }
      });
    }
  }

  function handleCopyLobbyCode() {
    scaleP.value = withTiming(0.7, { duration: 100 }, (finished) => {
      if (finished) {
        scaleP.value = withTiming(1, { duration: 100 });
      }
    });

    if (code !== "") {
      Clipboard.setStringAsync(code);
    }
  }

  function handleShareLobbyCode() {
    scaleS.value = withTiming(0.7, { duration: 100 }, (finished) => {
      if (finished) {
        scaleS.value = withTiming(1, { duration: 100 });
      }
    });

    if (code !== "") {
      async function shareCode() {
        try {
          await Share.share({
            message: "Join my Treachery Lobby with code: " + code,
          });
        } catch (error) {
          console.error("Error sharing lobby code:", error);
        }
      }

      shareCode();
    }
  }
  return (
    <>
      <View className="w-full h-50 items-center justify-center bg-zinc-600/20 rounded-2xl py-5 ">
        <View className="w-full h-20 flex-row items-center justify-center gap-4">
          <View className="w-min h-min bg-purple-500/10 border border-purple-300/50 px-4 py-2 rounded-full flex items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {code === "" ? "XXXXXX" : code}
            </Text>
          </View>
          <Pressable
            className="w-12 h-12 items-center justify-center rounded-xl border border-transparent active:bg-purple-500/20 active:border-purple-400/50 transition-colors duration-200 ease-in-out"
            onPress={handleCopyLobbyCode}
          >
            <Animated.View style={[scaleAnimationP]}>
              <Copy size={25} color="white" />
            </Animated.View>
          </Pressable>
          <Pressable
            className="w-12 h-12 items-center justify-center rounded-xl border border-transparent active:bg-purple-500/20 active:border-purple-400/50 transition-colors duration-200 ease-in-out"
            onPress={handleCreateLobby}
          >
            <Animated.View style={[rotateAnimationC, scaleAnimationC]}>
              <CirclePlus size={25} color="white" />
            </Animated.View>
          </Pressable>
        </View>
        <View className="w-full h-20 items-center justify-center px-10 py-4">
          <Pressable
            className="w-full h-full bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-300/50 active:bg-purple-500/20 active:border-purple-400/50 transition-colors duration-75 ease-in-out"
            onPress={handleShareLobbyCode}
          >
            <Animated.View
              className="flex-row items-center justify-center gap-4"
              style={[scaleAnimationS]}
            >
              <Share2 size={18} color="white" />
              <Text className="text-white text-xl font-bold">
                Share this code
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </>
  );
}
