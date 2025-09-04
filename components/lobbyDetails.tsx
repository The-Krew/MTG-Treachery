import React from "react";
import { View, Text, Share } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CirclePlus, Copy, Share2 } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { generateCode, usePlayerContext } from "@/components/playerContext";
import { Button } from "@/components/ui/button";
import { useInfoModalContext } from "@/components/interface/status";
import { Request } from "@/internal/types";

export default function LobbyDetails({
  wsRef,
}: {
  wsRef: React.MutableRefObject<WebSocket | null>;
}) {
  // --------------------------------------------------------------------------------------
  // States
  const { code, setCode } = usePlayerContext();
  console.log("LobbyDetails rerender", { code });
  const { openModal } = useInfoModalContext();

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

        const req: Request = {
          type: "lobby",
          method: "create",
          body: { code: genCode },
        };
        wsRef.current?.send(JSON.stringify(req));

        const reqInfo: Request = {
          type: "info",
          method: "info",
          body: { code: genCode },
        };

        wsRef.current?.send(JSON.stringify(reqInfo));

        setCode(genCode);
      }
    } else {
      openModal({
        title: "Error",
        message: "You are already in a lobby!",
        styleKey: "error",
      });
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
    } else {
      openModal({
        title: "Error",
        message: "You need to be in lobby to use this action!",
        styleKey: "error",
      });
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
    } else {
      openModal({
        title: "Error",
        message: "You need to be in lobby to use this action!",
        styleKey: "error",
      });
    }
  }
  return (
    <>
      <View className="w-full h-50 items-center justify-center bg-zinc-600/20 rounded-2xl py-5 ">
        <View className="w-full h-20 flex-row items-center justify-center gap-4">
          <View className="w-32 h-min bg-purple-500/10 border border-purple-300/50 px-4 py-2 rounded-full flex items-center justify-center">
            <Text
              className={
                "text-2xl font-bold" +
                (code === "" ? " text-gray-400" : " text-white")
              }
            >
              {code === "" ? "XXXXXX" : code}
            </Text>
          </View>
          <Button size="tiny" color="ghost" onPress={handleCopyLobbyCode}>
            <Animated.View style={[scaleAnimationP]}>
              <Copy size={25} color="white" />
            </Animated.View>
          </Button>
          <Button size="tiny" color="ghost" onPress={handleCreateLobby}>
            <Animated.View style={[rotateAnimationC, scaleAnimationC]}>
              <CirclePlus size={25} color="white" />
            </Animated.View>
          </Button>
        </View>
        <View className="w-full h-20 items-center justify-center px-10 py-4">
          <Button size="full" color="active" onPress={handleShareLobbyCode}>
            <Animated.View
              className="flex-row items-center justify-center gap-4"
              style={[scaleAnimationS]}
            >
              <Share2 size={18} color="white" />
              <Text className="text-white text-xl font-bold">
                Share this code
              </Text>
            </Animated.View>
          </Button>
        </View>
      </View>
    </>
  );
}
